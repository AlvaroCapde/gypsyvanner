/**
 * Reglas de cálculo y constantes para tarifas de plataforma y servicio digital.
 * 
 * Regla de negocio oficial:
 * Tarifa de plataforma = 7% del subtotal + $4.00 MXN
 */

export const PLATFORM_FEE_PERCENT = 0.07; // 7%
export const PLATFORM_FEE_FIXED_MXN = 4.00; // $4.00 MXN

export interface PlatformFeeCalculation {
  subtotalMxn: number;
  platformFeeMxn: number;
  totalMxn: number;
}

/**
 * Calcula la tarifa de plataforma (7% + $4 MXN) y el monto total final.
 * Redondea con precisión a 2 decimales para compatibilidad exacta con centavos de Stripe.
 */
export function calculatePlatformFee(subtotalMxn: number): PlatformFeeCalculation {
  const safeSubtotal = Math.max(0, subtotalMxn);
  const rawFee = safeSubtotal * PLATFORM_FEE_PERCENT + PLATFORM_FEE_FIXED_MXN;
  const platformFeeMxn = Number(rawFee.toFixed(2));
  const totalMxn = Number((safeSubtotal + platformFeeMxn).toFixed(2));

  return {
    subtotalMxn: safeSubtotal,
    platformFeeMxn,
    totalMxn,
  };
}

/**
 * Formatea un número en formato estándar de moneda mexicana (MXN).
 */
export function formatCurrencyMxn(amount: number, includeDecimals = false): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}
