-- =========================================================================
-- Migración: Agregar columnas para Pruebas Genéticas de Color Opcionales
-- Aplica para public.horse_registrations
-- Idempotente: seguro para correr múltiples veces
-- =========================================================================

ALTER TABLE public.horse_registrations
  ADD COLUMN IF NOT EXISTS selected_color_tests TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS color_tests_fee_usd NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS color_tests_fee_mxn NUMERIC(10, 2) DEFAULT 0;

COMMENT ON COLUMN public.horse_registrations.selected_color_tests IS 'Arreglo con los IDs de pruebas genéticas de color seleccionadas por el criador (opcionales, $25 USD / $450 MXN c/u)';
COMMENT ON COLUMN public.horse_registrations.color_tests_fee_usd IS 'Monto total en USD por concepto de pruebas genéticas de color';
COMMENT ON COLUMN public.horse_registrations.color_tests_fee_mxn IS 'Monto total en MXN por concepto de pruebas genéticas de color';
