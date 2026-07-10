import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia", // Use latest stable version or match your Stripe dashboard
});

const MEMBERSHIP_PRICES = {
  general: { name: "Membresía General (Anual)", price: 80, description: "Con derecho a voto, para propietarios de Gypsy Vanner." },
  associate: { name: "Membresía Asociado (Anual)", price: 50, description: "Sin derecho a voto, para amigos de la GVHS." },
  youth: { name: "Membresía Joven (Anual)", price: 25, description: "Membresía anual para jóvenes." },
  lifetime: { name: "Membresía Vitalicia", price: 1200, description: "Membresía de por vida." },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { membershipType, applicationType, name, farmName, email, telephone } = body;

    // Validate membershipType
    if (!membershipType || !(membershipType in MEMBERSHIP_PRICES)) {
      return NextResponse.json({ error: "Tipo de membresía inválido" }, { status: 400 });
    }

    const selectedMembership = MEMBERSHIP_PRICES[membershipType as keyof typeof MEMBERSHIP_PRICES];



    // Construct the absolute URL for success and cancel redirects
    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedMembership.name,
              description: selectedMembership.description,
            },
            unit_amount: selectedMembership.price * 100, // Stripe expects amounts in cents
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
        telephone,
      },
      success_url: `${origin}/membresia/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membresia?canceled=true`,
    });

    if (!session.url) {
      throw new Error("No se generó la URL de Stripe Checkout");
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
