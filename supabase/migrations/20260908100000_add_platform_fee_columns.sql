-- =========================================================================
-- Migración: Agregar columnas de tarifa de plataforma y auditoría de pagos
-- Aplica para public.memberships y public.horse_registrations
-- Idempotente: seguro para correr múltiples veces
-- =========================================================================

-- 1. Actualizar tabla public.memberships
ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS subtotal_mxn NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS platform_fee_mxn NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_paid_mxn NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- 2. Actualizar tabla public.horse_registrations
ALTER TABLE public.horse_registrations
  ADD COLUMN IF NOT EXISTS subtotal_fee_mxn NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS platform_fee_mxn NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- 3. Rellenar subtotal_fee_mxn para registros preexistentes si no tienen valor asignado
UPDATE public.horse_registrations
SET subtotal_fee_mxn = total_fee_mxn
WHERE subtotal_fee_mxn IS NULL;
