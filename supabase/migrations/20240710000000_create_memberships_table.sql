-- Crea un ENUM para el tipo de aplicación y membresía (opcional pero buena práctica)
CREATE TYPE public.application_type AS ENUM ('new', 'renewal');
CREATE TYPE public.membership_type AS ENUM ('general', 'associate', 'youth', 'lifetime');

-- Tabla de membresías, ligada a auth.users
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  farm_name TEXT,
  telephone TEXT NOT NULL,
  application_type public.application_type NOT NULL,
  membership_type public.membership_type NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Política de lectura: los miembros pueden ver su propia información
CREATE POLICY "Users can view their own membership"
  ON public.memberships
  FOR SELECT
  USING (auth.uid() = id);

-- (La inserción será realizada por un proceso con llave Service Role (Backend),
--  por lo que no necesitamos política de INSERT pública).

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
