-- =========================================================================
-- Migración: Agregar columnas para Prefijo de Rancho / Criadero Oficial
-- Aplica para public.memberships y public.horse_registrations
-- Idempotente: seguro para correr múltiples veces
-- =========================================================================

-- 1. Agregar columna farm_prefix a la tabla public.memberships
ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS farm_prefix TEXT;

COMMENT ON COLUMN public.memberships.farm_prefix IS 'Prefijo oficial registrado ante la GVHS para el rancho o criadero del socio';

-- 2. Agregar columnas de prefijo a la tabla public.horse_registrations
ALTER TABLE public.horse_registrations
  ADD COLUMN IF NOT EXISTS farm_prefix TEXT,
  ADD COLUMN IF NOT EXISTS is_purchasing_prefix BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS prefix_fee_usd NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS prefix_fee_mxn NUMERIC(10, 2) DEFAULT 0;

COMMENT ON COLUMN public.horse_registrations.farm_prefix IS 'Prefijo oficial aplicado al nombre del caballo';
COMMENT ON COLUMN public.horse_registrations.is_purchasing_prefix IS 'Indica si este trámite de registro incluyó la compra de un nuevo prefijo oficial de rancho ($200 USD)';
COMMENT ON COLUMN public.horse_registrations.prefix_fee_usd IS 'Monto cobrado en USD por concepto de registro de prefijo';
COMMENT ON COLUMN public.horse_registrations.prefix_fee_mxn IS 'Monto cobrado en MXN por concepto de registro de prefijo';
