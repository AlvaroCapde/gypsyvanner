-- ==========================================================
-- Migración: Tabla de Registro de Caballos con Integración de Pagos
-- Idempotente: puede ejecutarse en tablas nuevas o ya existentes
-- ==========================================================

-- 1. Crear tabla base si no existe
CREATE TABLE IF NOT EXISTS public.horse_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos de identidad y linaje
  horse_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  acquisition_date DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('stallion', 'mare')),
  birth_date DATE NOT NULL,
  country_of_birth TEXT NOT NULL,
  
  -- Información de pasaporte (condicional)
  has_passport BOOLEAN NOT NULL DEFAULT false,
  import_date DATE,
  passport_number TEXT,
  coat_color TEXT,
  coat_pattern TEXT,
  color_details TEXT,
  microchip_or_identifiers TEXT,
  
  -- Fotografías reglamentarias (URLs o data URIs)
  photo_left_url TEXT,
  photo_right_url TEXT,
  photo_front_url TEXT,
  photo_rear_url TEXT,
  
  -- Tarifas y pruebas calculadas (USD y MXN con tipo de cambio 18)
  age_category TEXT NOT NULL,
  base_fee_usd NUMERIC(10, 2) NOT NULL,
  dna_fee_usd NUMERIC(10, 2) NOT NULL,
  pssm_fis_fee_usd NUMERIC(10, 2) NOT NULL,
  total_fee_usd NUMERIC(10, 2) NOT NULL,
  
  base_fee_mxn NUMERIC(10, 2) NOT NULL,
  dna_fee_mxn NUMERIC(10, 2) NOT NULL,
  pssm_fis_fee_mxn NUMERIC(10, 2) NOT NULL,
  total_fee_mxn NUMERIC(10, 2) NOT NULL,
  
  -- Estatus y seguimiento de pago con Stripe
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,

  -- Estatus del trámite
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'submitted', 'under_review', 'dna_kit_sent', 'approved', 'rejected')),
  
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Asegurar columnas de pago en caso de que la tabla ya hubiese sido creada previamente
ALTER TABLE public.horse_registrations
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Actualizar restricción de status y payment_status de forma segura
DO $$
BEGIN
  -- Restricción de payment_status
  ALTER TABLE public.horse_registrations DROP CONSTRAINT IF EXISTS horse_registrations_payment_status_check;
  ALTER TABLE public.horse_registrations ADD CONSTRAINT horse_registrations_payment_status_check
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded'));

  -- Restricción de status (incluyendo 'pending_payment')
  ALTER TABLE public.horse_registrations DROP CONSTRAINT IF EXISTS horse_registrations_status_check;
  ALTER TABLE public.horse_registrations ADD CONSTRAINT horse_registrations_status_check 
    CHECK (status IN ('pending_payment', 'submitted', 'under_review', 'dna_kit_sent', 'approved', 'rejected'));
  
  ALTER TABLE public.horse_registrations ALTER COLUMN status SET DEFAULT 'pending_payment';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.horse_registrations ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS con DROP previo para evitar error 42710 ("policy already exists")
DROP POLICY IF EXISTS "Users can view their own horse registrations" ON public.horse_registrations;
CREATE POLICY "Users can view their own horse registrations"
  ON public.horse_registrations
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own horse registrations" ON public.horse_registrations;
CREATE POLICY "Users can insert their own horse registrations"
  ON public.horse_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own horse registrations" ON public.horse_registrations;
CREATE POLICY "Users can update their own horse registrations"
  ON public.horse_registrations
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- 5. Trigger para updated_at automático
DROP TRIGGER IF EXISTS horse_registrations_updated_at ON public.horse_registrations;
CREATE TRIGGER horse_registrations_updated_at
BEFORE UPDATE ON public.horse_registrations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
