import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/memberships";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Se requiere el identificador de sesión de pago (sessionId)." },
        { status: 400 }
      );
    }

    // Recuperar sesión directamente de Stripe para máxima seguridad
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "El pago no ha sido completado o no se pudo verificar con la pasarela de pago." },
        { status: 400 }
      );
    }

    const { registrationId, type, horseName } = session.metadata || {};

    if (!registrationId) {
      return NextResponse.json(
        { error: "La sesión de pago no contiene una referencia válida de registro de caballo." },
        { status: 400 }
      );
    }

    // Actualizar registro de manera idempotente (en caso de que el webhook aún esté en tránsito)
    const updatePayload: Record<string, any> = {
      payment_status: "paid",
      status: "under_review",
      stripe_session_id: session.id,
      paid_at: new Date().toISOString(),
    };

    if (session.payment_intent) {
      updatePayload.stripe_payment_intent_id =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent.id;
    }

    if (session.metadata?.subtotalMxn) {
      updatePayload.subtotal_fee_mxn = Number(session.metadata.subtotalMxn);
    }
    if (session.metadata?.platformFeeMxn) {
      updatePayload.platform_fee_mxn = Number(session.metadata.platformFeeMxn);
    }
    if (session.metadata?.totalFeeMxn) {
      updatePayload.total_fee_mxn = Number(session.metadata.totalFeeMxn);
    } else if (session.amount_total) {
      updatePayload.total_fee_mxn = session.amount_total / 100;
    }

    let { data: updated, error: updateError } = await supabaseAdmin
      .from("horse_registrations")
      .update(updatePayload)
      .eq("id", registrationId)
      .select("*")
      .single();

    // Si falla por columnas de platform fee no creadas aún en el esquema, reintentar sin ellas
    if (
      updateError &&
      (updateError.message?.includes("column") || (updateError as any).code === "PGRST204")
    ) {
      console.warn("Reintentando verificación de pago sin columnas de platform fee:", updateError.message);
      const { subtotal_fee_mxn: _sub, platform_fee_mxn: _pf, ...safePayload } = updatePayload;
      const retryResult = await supabaseAdmin
        .from("horse_registrations")
        .update(safePayload)
        .eq("id", registrationId)
        .select("*")
        .single();
      updated = retryResult.data;
      updateError = retryResult.error;
    }

    if (updateError) {
      console.error("Error al actualizar estatus de registro pagado:", updateError);
      // Si falla la consulta por otra razón, retornamos los datos mínimos desde la metadata de Stripe
      return NextResponse.json({
        success: true,
        registrationId,
        horseName: horseName || "Ejemplar",
        paymentStatus: "paid",
        status: "under_review",
        amountTotalMxn: (session.amount_total || 0) / 100,
        subtotalFeeMxn: session.metadata?.subtotalMxn ? Number(session.metadata.subtotalMxn) : undefined,
        platformFeeMxn: session.metadata?.platformFeeMxn ? Number(session.metadata.platformFeeMxn) : undefined,
      });
    }

    return NextResponse.json({
      success: true,
      registration: updated,
      registrationId: updated.id,
      horseName: updated.horse_name,
      ownerName: updated.owner_name,
      gender: updated.gender,
      birthDate: updated.birth_date,
      ageCategory: updated.age_category,
      countryOfBirth: updated.country_of_birth,
      currentHeight: updated.current_height,
      currentHeightDate: updated.current_height_date,
      expectedHeight: updated.expected_height,
      subtotalFeeMxn: updated.subtotal_fee_mxn || (session.metadata?.subtotalMxn ? Number(session.metadata.subtotalMxn) : undefined),
      platformFeeMxn: updated.platform_fee_mxn || (session.metadata?.platformFeeMxn ? Number(session.metadata.platformFeeMxn) : undefined),
      totalFeeMxn: updated.total_fee_mxn,
      paymentStatus: updated.payment_status,
      status: updated.status,
      createdAt: updated.created_at,
    });
  } catch (error: any) {
    console.error("Error verificando pago de registro de caballo:", error);
    return NextResponse.json(
      { error: error.message || "Ocurrió un error al verificar la sesión de pago." },
      { status: 500 }
    );
  }
}
