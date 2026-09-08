import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Initialize Supabase Admin Client
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Normalizes any phone input into strict E.164 format (+525512345678).
 * Defaults to 'MX' (Mexico) if no country is specified and number doesn't start with '+'.
 */
export function normalizePhoneNumber(phone: string, defaultCountry: CountryCode = "MX"): string | null {
  if (!phone) return null;
  const cleaned = phone.trim();
  const parsed = parsePhoneNumberFromString(cleaned, defaultCountry);
  if (parsed && parsed.isValid()) {
    return parsed.format("E.164");
  }
  return null;
}

/**
 * Masks a phone number for secure display (e.g. +52 ••••• ••78)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return cleaned;
  const prefix = cleaned.slice(0, 3);
  const suffix = cleaned.slice(-2);
  const maskedLength = Math.max(cleaned.length - 5, 4);
  return `${prefix} ${"•".repeat(maskedLength)} ${suffix}`;
}

export interface ProvisionResult {
  userId: string;
  phone: string;
  email?: string;
  name: string;
  isNewUser: boolean;
}

/**
 * Provisions or updates a user in Supabase Auth by phone number,
 * and upserts their active record in the public.memberships table.
 */
export async function provisionMember(params: {
  phone: string;
  email?: string;
  name: string;
  farmName?: string | null;
  applicationType?: string;
  membershipType?: string;
  street?: string | null;
  colonia?: string | null;
  postalCode?: string | null;
  city?: string | null;
  state?: string | null;
  subtotalMxn?: number | null;
  platformFeeMxn?: number | null;
  totalPaidMxn?: number | null;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  paidAt?: string | null;
}): Promise<ProvisionResult> {
  const {
    phone,
    email,
    name,
    farmName,
    applicationType = "new",
    membershipType = "associate",
    street,
    colonia,
    postalCode,
    city,
    state,
    subtotalMxn,
    platformFeeMxn,
    totalPaidMxn,
    stripeSessionId,
    stripePaymentIntentId,
    paidAt,
  } = params;

  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) {
    throw new Error(`Número de teléfono inválido: ${phone}`);
  }

  let userId: string;
  let isNewUser = false;

  // 1. Attempt to create user with phone and auto-confirm
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    phone: normalizedPhone,
    phone_confirm: true,
    user_metadata: {
      full_name: name,
      farm_name: farmName || null,
    },
  });

  if (createError) {
    // If user already exists, retrieve existing user ID
    if (
      createError.message.includes("already been registered") ||
      createError.message.includes("already exists") ||
      (createError as any).code === "phone_exists"
    ) {
      const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) throw listError;

      const existingUser = listData.users.find(
        (u) => u.phone === normalizedPhone || (email && u.email === email)
      );

      if (!existingUser) {
        throw new Error("No se pudo localizar el usuario existente en Supabase Auth.");
      }

      userId = existingUser.id;

      // Update metadata and phone if needed (keep minimal to avoid large JWT cookie header)
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        phone: normalizedPhone,
        phone_confirm: true,
        user_metadata: {
          full_name: name || existingUser.user_metadata?.full_name,
          farm_name: farmName ?? existingUser.user_metadata?.farm_name,
        },
      });
    } else {
      throw createError;
    }
  } else {
    userId = newUser.user.id;
    isNewUser = true;

    // Attach email if provided and not present
    if (email) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          email,
          email_confirm: true,
        });
      } catch (emailErr) {
        console.warn("No se pudo enlazar email secundario al usuario:", emailErr);
      }
    }
  }

  // 2. Upsert record in public.memberships
  const membershipData: Record<string, any> = {
    id: userId,
    email: email || "",
    name,
    farm_name: farmName || null,
    telephone: normalizedPhone,
    application_type: applicationType,
    membership_type: membershipType,
    status: "active",
  };

  if (street) membershipData.street = street;
  if (colonia) membershipData.colonia = colonia;
  if (postalCode) membershipData.postal_code = postalCode;
  if (city) membershipData.city = city;
  if (state) membershipData.state = state;

  if (subtotalMxn !== undefined && subtotalMxn !== null) membershipData.subtotal_mxn = subtotalMxn;
  if (platformFeeMxn !== undefined && platformFeeMxn !== null) membershipData.platform_fee_mxn = platformFeeMxn;
  if (totalPaidMxn !== undefined && totalPaidMxn !== null) membershipData.total_paid_mxn = totalPaidMxn;
  if (stripeSessionId) membershipData.stripe_session_id = stripeSessionId;
  if (stripePaymentIntentId) membershipData.stripe_payment_intent_id = stripePaymentIntentId;
  if (paidAt) membershipData.paid_at = paidAt;

  let { error: insertError } = await supabaseAdmin
    .from("memberships")
    .upsert(membershipData);

  // Fallback if payment or address columns aren't in table schema yet
  if (
    insertError &&
    (insertError.message?.includes("column") || insertError.code === "PGRST204")
  ) {
    console.warn("Reintentando upsert de membresía con esquema base:", insertError.message);
    const baseData = {
      id: userId,
      email: email || "",
      name,
      farm_name: farmName || null,
      telephone: normalizedPhone,
      application_type: applicationType,
      membership_type: membershipType,
      status: "active",
    };
    const retryResult = await supabaseAdmin.from("memberships").upsert(baseData);
    insertError = retryResult.error;
  }

  if (insertError) {
    console.error("Error al registrar membresía en tabla:", insertError);
    throw insertError;
  }

  return {
    userId,
    phone: normalizedPhone,
    email,
    name,
    isNewUser,
  };
}
