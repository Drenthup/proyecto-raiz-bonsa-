-- Raíz Bonsái · migración aditiva para cuentas de clientes.
-- Ejecutar una sola vez en Supabase -> SQL Editor.
-- No cambia la tabla usuarios (administradores), productos, mensajes o RLS existente.
CREATE TABLE IF NOT EXISTS public.clientes (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL CHECK (length(btrim(nombre)) >= 2),
  email VARCHAR(254) NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash TEXT NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- El navegador nunca consulta clientes directamente mediante la anon key.
-- Solo la API Node/Express usa su conexión PostgreSQL privada.
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS clientes_creado_en_idx ON public.clientes (creado_en DESC);
