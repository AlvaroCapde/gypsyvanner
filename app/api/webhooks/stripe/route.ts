import { NextResponse } from "next/server";
import Stripe from "stripe";
import { provisionMember, supabaseAdmin } from "@/lib/memberships";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing stripe signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // Caso 1: Registro de Caballo
    if (metadata.type === "horse_registration" || metadata.registrationId) {
      const registrationId = metadata.registrationId;
      if (!registrationId) {
        console.error("No se encontró registrationId en la metadata de la sesión");
        return new NextResponse("Invalid horse registration metadata", { status: 400 });
      }

      try {
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

        if (metadata.subtotalMxn) {
          updatePayload.subtotal_fee_mxn = Number(metadata.subtotalMxn);
        }
        if (metadata.platformFeeMxn) {
          updatePayload.platform_fee_mxn = Number(metadata.platformFeeMxn);
        }
        if (metadata.totalFeeMxn) {
          updatePayload.total_fee_mxn = Number(metadata.totalFeeMxn);
        } else if (session.amount_total) {
          updatePayload.total_fee_mxn = session.amount_total / 100;
        }

        let { error: updateError } = await supabaseAdmin
          .from("horse_registrations")
          .update(updatePayload)
          .eq("id", registrationId);

        // Si falla por columnas de platform fee no creadas en el esquema, reintentar sin ellas
        if (
          updateError &&
          (updateError.message?.includes("column") || (updateError as any).code === "PGRST204")
        ) {
          console.warn("Reintentando actualización de pago de caballo sin columnas de platform fee:", updateError.message);
          const { subtotal_fee_mxn: _sub, platform_fee_mxn: _pf, ...safePayload } = updatePayload;
          const retryResult = await supabaseAdmin
            .from("horse_registrations")
            .update(safePayload)
            .eq("id", registrationId);
          updateError = retryResult.error;
        }

        if (updateError) {
          console.error("Error al actualizar registro de caballo desde webhook:", updateError);
          return new NextResponse("Error updating horse registration", { status: 500 });
        }

        // Si la solicitud incluyó la compra de un nuevo prefijo oficial de rancho,
        // guardarlo permanentemente en el perfil de membresía del socio
        if (metadata.isPurchasingPrefix === "true" && metadata.farmPrefix && metadata.userId) {
          try {
            await supabaseAdmin
              .from("memberships")
              .update({ farm_prefix: metadata.farmPrefix })
              .eq("id", metadata.userId);
            console.log(
              `Prefijo oficial "${metadata.farmPrefix}" vinculado exitosamente a la membresía del usuario ${metadata.userId}`
            );
          } catch (prefixErr) {
            console.warn("No se pudo actualizar farm_prefix en memberships desde webhook:", prefixErr);
          }
        }

        console.log(`Registro de caballo ${registrationId} actualizado a pagado / en revisión.`);
        return new NextResponse("Success", { status: 200 });
      } catch (err: any) {
        console.error("Error procesando webhook de caballo:", err);
        return new NextResponse("Error processing horse registration webhook", { status: 500 });
      }
    }

    // Caso 2: Membresía anual
    const { 
      email, 
      name, 
      telephone, 
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
    } = metadata;

    if (!email) {
      console.error("No email found in session metadata");
      return new NextResponse("Invalid metadata", { status: 400 });
    }

    try {
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      await provisionMember({
        phone: telephone,
        email,
        name,
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

      console.log(`Successfully processed membership for phone: ${telephone} (${email})`);
    } catch (err: any) {
      console.error("Error processing webhook data:", err);
      return new NextResponse("Error processing webhook data", { status: 500 });
    }
  }

  return new NextResponse("Success", { status: 200 });
}
