import { NextResponse } from "next/server";
import Stripe from "stripe";
import { provisionMember, maskPhoneNumber, supabaseAdmin } from "@/lib/memberships";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Se requiere el ID de sesión de pago (sessionId)." },
        { status: 400 }
      );
    }

    // Retrieve session directly from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "El pago no ha sido completado o no se pudo verificar con la pasarela de pago." },
        { status: 400 }
      );
    }

    const {
      telephone,
      name,
      email,
      farmName,
      applicationType,
      membershipType,
      street,
      colonia,
      postalCode,
      city,
      state,
      subtotalMxn,
      platformFeeMxn,
      totalPaidMxn,
    } = session.metadata || {};

    if (!telephone) {
      return NextResponse.json(
        { error: "La sesión de pago no contiene información telefónica." },
        { status: 400 }
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    // Ensure member and auth user exist (idempotent against webhook race condition)
    const provisionResult = await provisionMember({
      phone: telephone,
      email,
      name: name || "Socio GVHS",
      farmName,
      applicationType,
      membershipType,
      street,
      colonia,
      postalCode,
      city,
      state,
      subtotalMxn: subtotalMxn ? Number(subtotalMxn) : 900,
      platformFeeMxn: platformFeeMxn ? Number(platformFeeMxn) : 67,
      totalPaidMxn: session.amount_total ? session.amount_total / 100 : (totalPaidMxn ? Number(totalPaidMxn) : 967),
      stripeSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      paidAt: new Date().toISOString(),
    });

    // Send SMS OTP code via Supabase (Twilio)
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
      phone: provisionResult.phone,
    });

    if (otpError) {
      console.error("Error al enviar código SMS OTP:", otpError);
    }

    return NextResponse.json({
      success: true,
      phone: provisionResult.phone,
      maskedPhone: maskPhoneNumber(provisionResult.phone),
      name: provisionResult.name,
      email: provisionResult.email,
      otpSent: !otpError,
    });
  } catch (error: any) {
    console.error("Error verificando pago en Stripe:", error);
    return NextResponse.json(
      { error: error.message || "Ocurrió un error al verificar tu sesión de pago." },
      { status: 500 }
    );
  }
}
