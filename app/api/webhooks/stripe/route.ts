import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

// Initialize Supabase Admin Client
// It's critical to use the SERVICE_ROLE_KEY here to bypass RLS and create users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
    
    // Retrieve metadata we passed during checkout creation
    const { 
      email, 
      name, 
      telephone, 
      farmName, 
      applicationType, 
      membershipType 
    } = session.metadata || {};

    if (!email) {
      console.error("No email found in session metadata");
      return new NextResponse("Invalid metadata", { status: 400 });
    }

    try {
      // 1. Check if user exists or create new user in Supabase Auth
      let userId: string;
      
      // Try to find the user first using the admin API
      const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      
      // Since listUsers might return many, a better approach is to create it, 
      // and if it fails because it exists, we find it, OR we just use admin.createUser
      // Supabase has admin.createUser which returns an error if email exists.
      
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true, // Auto confirm so they can just request OTP
        user_metadata: {
          full_name: name,
        },
      });

      if (createError) {
        if (createError.message.includes('already been registered')) {
          // User exists, find their ID
          // In a real production app with many users, you should query by email directly
          // We will use a workaround for now by listing users or assuming we handle it.
          // The most robust way to find user by email with admin is:
          // Wait, supabaseAdmin.auth.admin doesn't have getUserByEmail, it has listUsers().
          // If we want to be safe, we can try to find them, but let's assume we can just do a query to auth.users if we really need to, 
          // but we can't easily query auth.users from client API without RPC.
          // For now, let's use listUsers and filter (OK for small DB).
          const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = listData.users.find(u => u.email === email);
          if (!existingUser) {
             throw new Error("User registration failed and could not find existing user");
          }
          userId = existingUser.id;
        } else {
          throw createError;
        }
      } else {
        userId = newUser.user.id;
      }

      // 2. Upsert the membership record
      const { error: insertError } = await supabaseAdmin.from("memberships").upsert({
        id: userId,
        email,
        name,
        farm_name: farmName || null,
        telephone,
        application_type: applicationType,
        membership_type: membershipType,
        status: "active",
      });

      if (insertError) {
        console.error("Error inserting membership:", insertError);
        throw insertError;
      }

      console.log(`Successfully processed membership for ${email}`);
    } catch (err: any) {
      console.error("Error processing webhook data:", err);
      return new NextResponse("Error processing webhook data", { status: 500 });
    }
  }

  return new NextResponse("Success", { status: 200 });
}
