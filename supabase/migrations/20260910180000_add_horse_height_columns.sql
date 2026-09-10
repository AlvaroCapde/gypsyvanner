-- ==========================================================
-- Migración: Columnas de estatura y alzada en horse_registrations
-- Idempotente: agrega current_height, current_height_date y expected_height
-- ==========================================================

ALTER TABLE public.horse_registrations
  ADD COLUMN IF NOT EXISTS current_height TEXT,
  ADD COLUMN IF NOT EXISTS current_height_date DATE,
  ADD COLUMN IF NOT EXISTS expected_height TEXT;

COMMENT ON COLUMN public.horse_registrations.current_height IS 'Estatura actual del caballo (ej. 14.2 hh o 148 cm)';
COMMENT ON COLUMN public.horse_registrations.current_height_date IS 'Fecha en que se tomó la medición de estatura actual';
COMMENT ON COLUMN public.horse_registrations.expected_height IS 'Estatura esperada del caballo a la madurez (ej. 14.2 hh o 150 cm)';
