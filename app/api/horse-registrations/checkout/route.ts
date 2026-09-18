import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/memberships";
import {
  calculateHorseFee,
  horseRegistrationSchema,
} from "@/lib/horse-registration";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para registrar un caballo." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validar datos de formulario con Zod
    const validationResult = horseRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Datos del formulario inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validated = validationResult.data;

    // Verificar si el usuario ya cuenta con un prefijo oficial registrado en su membresía
    const { data: userMembership } = await supabaseAdmin
      .from("memberships")
      .select("farm_prefix")
      .eq("id", user.id)
      .maybeSingle();

    const hasDbPrefix = Boolean(userMembership?.farm_prefix);
    const isPurchasingPrefix = !hasDbPrefix && Boolean(validated.wantsToPurchasePrefix);
    const finalFarmPrefix = hasDbPrefix
      ? userMembership?.farm_prefix
      : isPurchasingPrefix
      ? validated.farmPrefix?.trim() || null
      : null;

    // Calcular tarifas de forma autoritativa (incluyendo pruebas de color y prefijo si aplica)
    const feeBreakdown = calculateHorseFee(
      validated.birthDate,
      validated.selectedColorTests || [],
      isPurchasingPrefix,
      finalFarmPrefix || ""
    );

    // 1. Guardar o actualizar registro preliminar en la base de datos (con estatus pending_payment)
    let registrationId: string | null = null;
    const fullPayload = {
      user_id: user.id,
      horse_name: validated.horseName.trim(),
      farm_prefix: finalFarmPrefix,
      is_purchasing_prefix: isPurchasingPrefix,
      prefix_fee_usd: feeBreakdown.prefixFeeUsd,
      prefix_fee_mxn: feeBreakdown.prefixFeeMxn,
      owner_name: validated.ownerName.trim(),
      acquisition_date: validated.acquisitionDate,
      gender: validated.gender,
      birth_date: validated.birthDate,
      countryOfBirth: validated.countryOfBirth,
      country_of_birth: validated.countryOfBirth,
      current_height: validated.currentHeight || null,
      current_height_date: validated.currentHeightDate || null,
      expected_height: validated.expectedHeight || null,
      has_passport: validated.hasPassport,
      import_date: validated.importDate || null,
      passport_number: validated.passportNumber || null,
      coat_color: validated.coatColor || null,
      coat_pattern: validated.coatPattern || null,
      color_details: validated.colorDetails || null,
      microchip_or_identifiers: validated.microchipOrIdentifiers || null,
      photo_left_url: validated.photoLeft,
      photo_right_url: validated.photoRight,
      photo_front_url: validated.photoFront,
      photo_rear_url: validated.photoRear,
      selected_color_tests: validated.selectedColorTests || [],
      color_tests_fee_usd: feeBreakdown.colorTestsFeeUsd,
      color_tests_fee_mxn: feeBreakdown.colorTestsFeeMxn,
      age_category: feeBreakdown.ageCategory,
      base_fee_usd: feeBreakdown.baseFeeUsd,
      dna_fee_usd: feeBreakdown.dnaFeeUsd,
      pssm_fis_fee_usd: feeBreakdown.pssmFisFeeUsd,
      total_fee_usd: feeBreakdown.totalFeeUsd,
      base_fee_mxn: feeBreakdown.baseFeeMxn,
      dna_fee_mxn: feeBreakdown.dnaFeeMxn,
      pssm_fis_fee_mxn: feeBreakdown.pssmFisFeeMxn,
      subtotal_fee_mxn: feeBreakdown.subtotalFeeMxn,
      platform_fee_mxn: feeBreakdown.platformFeeMxn,
      total_fee_mxn: feeBreakdown.totalFeeMxn,
      payment_status: "unpaid",
      status: "pending_payment",
    };

    // Payload de compatibilidad (sin columnas de platform fee, color tests, estatura ni prefijo si aún no se ejecutan migraciones)
    const {
      subtotal_fee_mxn: _sub,
      platform_fee_mxn: _pf,
      countryOfBirth: _cob,
      selected_color_tests: _sct,
      color_tests_fee_usd: _ctfu,
      color_tests_fee_mxn: _ctfm,
      current_height: _ch,
      current_height_date: _chd,
      expected_height: _eh,
      farm_prefix: _fp,
      is_purchasing_prefix: _ipp,
      prefix_fee_usd: _pfu,
      prefix_fee_mxn: _pfm,
      ...legacyPayload
    } = fullPayload;

    // Buscar si ya existe un borrador previo no pagado para evitar duplicados:
    // A) Por draftId explícito
    // B) O por coincidencia de usuario + nombre del caballo en estatus unpaid
    let targetDraftId: string | null = validated.draftId || null;

    if (!targetDraftId) {
      const { data: existingUnpaid } = await supabaseAdmin
        .from("horse_registrations")
        .select("id")
        .eq("user_id", user.id)
        .eq("horse_name", validated.horseName.trim())
        .eq("payment_status", "unpaid")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingUnpaid?.id) {
        targetDraftId = existingUnpaid.id;
      }
    }

    if (targetDraftId) {
      // Intentar actualizar el borrador existente
      let { error: updateError } = await supabaseAdmin
        .from("horse_registrations")
        .update(fullPayload)
        .eq("id", targetDraftId)
        .eq("user_id", user.id);

      // Si falla por columnas nuevas no presentes en el esquema, reintentar con el payload legacy
      if (
        updateError &&
        (updateError.message?.includes("column") || (updateError as any).code === "PGRST204")
      ) {
        console.warn("Reintentando actualización sin columnas nuevas:", updateError.message);
        const retryUpdate = await supabaseAdmin
          .from("horse_registrations")
          .update(legacyPayload)
          .eq("id", targetDraftId)
          .eq("user_id", user.id);
        updateError = retryUpdate.error;
      }

      if (!updateError) {
        registrationId = targetDraftId;
      } else {
        console.error("Error actualizando borrador existente:", updateError.message);
      }
    }

    // Si no había borrador existente o la actualización falló, insertar uno nuevo de forma segura
    if (!registrationId) {
      let { data: inserted, error: insertError } = await supabaseAdmin
        .from("horse_registrations")
        .insert(fullPayload)
        .select("id")
        .single();

      // Si falla por columnas no creadas aún, reintentar sin ellas
      if (
        insertError &&
        (insertError.message?.includes("column") || (insertError as any).code === "PGRST204")
      ) {
        console.warn("Reintentando inserción sin columnas nuevas:", insertError.message);
        const retryResult = await supabaseAdmin
          .from("horse_registrations")
          .insert(legacyPayload)
          .select("id")
          .single();
        inserted = retryResult.data;
        insertError = retryResult.error;
      }

      if (insertError || !inserted?.id) {
        console.error("Error al registrar solicitud en base de datos:", insertError);
        return NextResponse.json(
          {
            error:
              "No se pudo guardar la solicitud preliminar. Asegúrate de haber ejecutado la migración en Supabase.",
          },
          { status: 500 }
        );
      }
      registrationId = inserted.id;
    }

    if (!registrationId) {
      throw new Error("No se pudo obtener el identificador del registro.");
    }

    // 2. Crear sesión de Stripe Checkout
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "es-419",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Pre-Registro de Ejemplar: ${
                finalFarmPrefix ? `${finalFarmPrefix} ` : ""
              }${validated.horseName.trim()}`,
              description: `Tarifa de pre-registro según categoría (${feeBreakdown.categoryLabel}).`,
            },
            unit_amount: Math.round(feeBreakdown.baseFeeMxn * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Prueba de ADN Obligatoria",
              description: "Verificación de marcadores genéticos y linaje de raza.",
            },
            unit_amount: Math.round(feeBreakdown.dnaFeeMxn * 100),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Pruebas PSSM1 y FIS",
              description: "Detección oficial de Miopatía por Almacenamiento y Síndrome de Inmunodeficiencia.",
            },
            unit_amount: Math.round(feeBreakdown.pssmFisFeeMxn * 100),
          },
          quantity: 1,
        },
        ...(feeBreakdown.colorTestsCount > 0
          ? [
              {
                price_data: {
                  currency: "mxn",
                  product_data: {
                    name: `Pruebas Genéticas de Color (${feeBreakdown.colorTestsCount} ${
                      feeBreakdown.colorTestsCount === 1 ? "prueba" : "pruebas"
                    })`,
                    description: (validated.selectedColorTests || []).join(", "),
                  },
                  unit_amount: Math.round(feeBreakdown.colorTestsFeeMxn * 100),
                },
                quantity: 1,
              },
            ]
          : []),
        ...(isPurchasingPrefix
          ? [
              {
                price_data: {
                  currency: "mxn",
                  product_data: {
                    name: `Registro Oficial de Prefijo: ${finalFarmPrefix}`,
                    description: "Adquisición y protección exclusiva de prefijo para criadero ante GVHS México.",
                  },
                  unit_amount: Math.round(feeBreakdown.prefixFeeMxn * 100),
                },
                quantity: 1,
              },
            ]
          : []),
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Tarifa de servicio",
              description: "Procesamiento y gestión digital.",
            },
            unit_amount: Math.round(feeBreakdown.platformFeeMxn * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "horse_registration",
        registrationId,
        userId: user.id,
        horseName: validated.horseName.trim(),
        farmPrefix: finalFarmPrefix || "",
        isPurchasingPrefix: String(isPurchasingPrefix),
        prefixFeeMxn: String(feeBreakdown.prefixFeeMxn),
        ownerName: validated.ownerName.trim(),
        userEmail: user.email || "",
        subtotalMxn: String(feeBreakdown.subtotalFeeMxn),
        colorTestsCount: String(feeBreakdown.colorTestsCount),
        colorTestsFeeMxn: String(feeBreakdown.colorTestsFeeMxn),
        platformFeeMxn: String(feeBreakdown.platformFeeMxn),
        totalFeeMxn: String(feeBreakdown.totalFeeMxn),
      },
      success_url: `${origin}/dashboard/registro-caballo/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/registro-caballo?canceled=true&draft_id=${registrationId}`,
    });

    if (!session.url) {
      throw new Error("No se generó el enlace a la pasarela de pago");
    }

    // Guardar el stripe_session_id en el registro para trazabilidad
    await supabaseAdmin
      .from("horse_registrations")
      .update({ stripe_session_id: session.id })
      .eq("id", registrationId);

    return NextResponse.json({
      url: session.url,
      registrationId,
      subtotalFeeMxn: feeBreakdown.subtotalFeeMxn,
      platformFeeMxn: feeBreakdown.platformFeeMxn,
      totalFeeMxn: feeBreakdown.totalFeeMxn,
    });
  } catch (err: any) {
    console.error("Error al generar sesión de checkout para caballo:", err);
    return NextResponse.json(
      { error: err.message || "Ocurrió un error al preparar la pasarela de pago." },
      { status: 500 }
    );
  }
}
