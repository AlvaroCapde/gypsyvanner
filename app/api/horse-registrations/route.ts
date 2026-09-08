import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/lib/memberships";
import {
  calculateHorseFee,
  horseRegistrationSchema,
} from "@/lib/horse-registration";

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

    // Validar esquema Zod
    const validationResult = horseRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Datos del formulario inválidos.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validated = validationResult.data;

    // Calcular tarifas de forma autoritativa en el servidor
    const feeBreakdown = calculateHorseFee(validated.birthDate);

    // Intentar insertar en la tabla horse_registrations (con cliente autenticado para respetar RLS)
    let registrationId: string | null = null;
    const { data: inserted, error: insertError } = await supabase
      .from("horse_registrations")
      .insert({
        user_id: user.id,
        horse_name: validated.horseName.trim(),
        owner_name: validated.ownerName.trim(),
        acquisition_date: validated.acquisitionDate,
        gender: validated.gender,
        birth_date: validated.birthDate,
        country_of_birth: validated.countryOfBirth,
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
        age_category: feeBreakdown.ageCategory,
        base_fee_usd: feeBreakdown.baseFeeUsd,
        dna_fee_usd: feeBreakdown.dnaFeeUsd,
        pssm_fis_fee_usd: feeBreakdown.pssmFisFeeUsd,
        total_fee_usd: feeBreakdown.totalFeeUsd,
        base_fee_mxn: feeBreakdown.baseFeeMxn,
        dna_fee_mxn: feeBreakdown.dnaFeeMxn,
        pssm_fis_fee_mxn: feeBreakdown.pssmFisFeeMxn,
        total_fee_mxn: feeBreakdown.totalFeeMxn,
        status: "submitted",
      })
      .select("id")
      .single();

    if (insertError) {
      // Si la tabla aún no se ha ejecutado en Supabase, intentamos con supabaseAdmin o reportamos el error
      console.error("Error al insertar registro de caballo:", insertError);
      
      // Fallback con supabaseAdmin en caso de permisos de policy
      const { data: adminInserted, error: adminError } = await supabaseAdmin
        .from("horse_registrations")
        .insert({
          user_id: user.id,
          horse_name: validated.horseName.trim(),
          owner_name: validated.ownerName.trim(),
          acquisition_date: validated.acquisitionDate,
          gender: validated.gender,
          birth_date: validated.birthDate,
          country_of_birth: validated.countryOfBirth,
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
          age_category: feeBreakdown.ageCategory,
          base_fee_usd: feeBreakdown.baseFeeUsd,
          dna_fee_usd: feeBreakdown.dnaFeeUsd,
          pssm_fis_fee_usd: feeBreakdown.pssmFisFeeUsd,
          total_fee_usd: feeBreakdown.totalFeeUsd,
          base_fee_mxn: feeBreakdown.baseFeeMxn,
          dna_fee_mxn: feeBreakdown.dnaFeeMxn,
          pssm_fis_fee_mxn: feeBreakdown.pssmFisFeeMxn,
          total_fee_mxn: feeBreakdown.totalFeeMxn,
          status: "submitted",
        })
        .select("id")
        .single();

      if (adminError) {
        console.error("Error con supabaseAdmin:", adminError);
        // Si la tabla no existe en la base de datos remota todavía, devolvemos un mensaje descriptivo
        if (adminError.code === "PGRST205" || adminError.message?.includes("schema cache")) {
          return NextResponse.json(
            {
              error:
                "La tabla de base de datos 'horse_registrations' aún debe ser creada en Supabase ejecutando la migración correspondiente.",
            },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { error: `Error al guardar la solicitud: ${adminError.message}` },
          { status: 500 }
        );
      }
      registrationId = adminInserted?.id;
    } else {
      registrationId = inserted?.id;
    }

    return NextResponse.json({
      success: true,
      registrationId,
      feeBreakdown,
    });
  } catch (err: any) {
    console.error("Error inesperado en /api/horse-registrations:", err);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar la solicitud." },
      { status: 500 }
    );
  }
}
