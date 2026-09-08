import { NextResponse } from "next/server";
import Stripe from "stripe";
import { normalizePhoneNumber } from "@/lib/memberships";
import { calculatePlatformFee } from "@/lib/fees";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia", // Use latest stable version or match your Stripe dashboard
});

const MEMBERSHIP_PRICES = {
  associate: { name: "Membresía de Asociado (Anual)", price: 900, description: "Membresía anual oficial GVHS México." },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      membershipType = "associate", 
      applicationType = "new", 
      name, 
      farmName, 
      email, 
      telephone,
      street,
      colonia,
      postalCode,
      city,
      state
    } = body;

    // Validate membershipType
    if (!membershipType || !(membershipType in MEMBERSHIP_PRICES)) {
      return NextResponse.json({ error: "Tipo de membresía inválido" }, { status: 400 });
    }

    // Validate & normalize phone number to strict E.164
    const normalizedPhone = normalizePhoneNumber(telephone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "El formato del teléfono es inválido. Ingresa un número válido de 10 dígitos (México) o formato internacional." },
        { status: 400 }
      );
    }

    const selectedMembership = MEMBERSHIP_PRICES[membershipType as keyof typeof MEMBERSHIP_PRICES];
    const { subtotalMxn, platformFeeMxn, totalMxn } = calculatePlatformFee(selectedMembership.price);

    // Construct the absolute URL for success and cancel redirects
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      locale: "es-419",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: selectedMembership.name,
              description: selectedMembership.description,
            },
            unit_amount: Math.round(subtotalMxn * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Tarifa de servicio",
              description: "Procesamiento y gestión digital.",
            },
            unit_amount: Math.round(platformFeeMxn * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        applicationType,
        membershipType,
        name,
        email,
        farmName: farmName || "",
        telephone: normalizedPhone,
        street: street || "",
        colonia: colonia || "",
        postalCode: postalCode || "",
        city: city || "",
        state: state || "",
        subtotalMxn: String(subtotalMxn),
        platformFeeMxn: String(platformFeeMxn),
        totalPaidMxn: String(totalMxn),
      },
      success_url: `${origin}/membresia/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membresia?canceled=true`,
    });

    if (!session.url) {
      throw new Error("No se generó el enlace a la pasarela de pago");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Error al crear sesión de checkout:", err);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar la solicitud de pago." },
      { status: 500 }
    );
  }
}
