-- Script de atualização completa das tabelas e relacionamentos (V3)
-- Inclui: Users (Auth), Pets, Atendimentos, Atendimento_Servico
-- Ordem de execução: Limpeza -> Criação -> RLS -> Políticas

-- 1. Limpeza (Drop) de tabelas dependentes
-- A ordem importa para evitar erro de dependência (Foreign Keys)
DROP TABLE IF EXISTS public.atendimento_servico;
DROP TABLE IF EXISTS public.atendimentos;
DROP TABLE IF EXISTS public.pets;
DROP TABLE IF EXISTS public.clientes;

-- 2. Tabela USERS (Vinculada ao AUTH.USERS)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'patient',
  telefone text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email)
) TABLESPACE pg_default;

-- Adiciona o relacionamento com auth.users se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_id_fkey' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users 
        ADD CONSTRAINT users_id_fkey 
        FOREIGN KEY (id) 
        REFERENCES auth.users (id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Tabela PETS (Vinculada a USERS)
CREATE TABLE public.pets (
   pet_id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
   cliente_id uuid NOT NULL, -- FK para users
   nome text NOT NULL,
   raca text NULL,
   idade integer NULL,
   observacoes text NULL,
   created_at timestamp with time zone DEFAULT now(),
   
   CONSTRAINT pets_pkey PRIMARY KEY (pet_id),
   CONSTRAINT pets_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- 4. Tabela ATENDIMENTOS (Vinculada a USERS e PETS)
CREATE TABLE public.atendimentos (
   atendimento_id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
   cliente_id uuid NOT NULL, -- FK para users
   pet_id uuid NOT NULL,     -- FK para pets
   data_solicitacao timestamp with time zone NULL DEFAULT now(),
   status text NOT NULL DEFAULT 'aguardando'::text,
   observacoes text NULL,
   
   CONSTRAINT atendimentos_pkey PRIMARY KEY (atendimento_id),
   CONSTRAINT atendimentos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.users (id) ON DELETE CASCADE,
   CONSTRAINT atendimentos_pet_id_fkey FOREIGN KEY (pet_id) REFERENCES public.pets (pet_id) ON DELETE CASCADE,
   
   CONSTRAINT status_valido CHECK (
     status = ANY (ARRAY['aguardando'::text, 'em_banho'::text, 'finalizado'::text])
   )
) TABLESPACE pg_default;

-- 5. Tabela ATENDIMENTO_SERVICO (Vinculada a ATENDIMENTOS e SERVICOS)
-- Certifique-se de que a tabela 'servicos' já existe no seu banco.
CREATE TABLE IF NOT EXISTS public.atendimento_servico ( 
   id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(), 
   atendimento_id uuid NOT NULL, 
   servico_id uuid NOT NULL, 
   preco_aplicado numeric(10, 2) NULL, 
   
   CONSTRAINT atendimento_servico_pkey PRIMARY KEY (id), 
   CONSTRAINT atendimento_servico_atendimento_id_fkey FOREIGN KEY (atendimento_id) REFERENCES public.atendimentos (atendimento_id) ON DELETE CASCADE, 
   -- Assumindo que a tabela servicos existe e tem PK servico_id
   CONSTRAINT atendimento_servico_servico_id_fkey FOREIGN KEY (servico_id) REFERENCES public.servicos (servico_id) 
) TABLESPACE pg_default;

-- 6. Configuração de Segurança (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atendimento_servico ENABLE ROW LEVEL SECURITY;

-- Limpeza de políticas antigas
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

DROP POLICY IF EXISTS "Pets: Ver todos" ON public.pets;
DROP POLICY IF EXISTS "Pets: Criar próprios" ON public.pets;
DROP POLICY IF EXISTS "Pets: Atualizar próprios" ON public.pets;
DROP POLICY IF EXISTS "Pets: Deletar próprios" ON public.pets;

DROP POLICY IF EXISTS "Atendimentos: Ver todos" ON public.atendimentos;
DROP POLICY IF EXISTS "Atendimentos: Criar" ON public.atendimentos;
DROP POLICY IF EXISTS "Atendimentos: Atualizar" ON public.atendimentos;
DROP POLICY IF EXISTS "Atendimentos: Deletar" ON public.atendimentos;

DROP POLICY IF EXISTS "AtendimentoServico: Ver todos" ON public.atendimento_servico;
DROP POLICY IF EXISTS "AtendimentoServico: Criar" ON public.atendimento_servico;
DROP POLICY IF EXISTS "AtendimentoServico: Atualizar" ON public.atendimento_servico;
DROP POLICY IF EXISTS "AtendimentoServico: Deletar" ON public.atendimento_servico;

-- 7. Políticas de Acesso (Permissivas)

-- Users
CREATE POLICY "Public users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (true);

-- Pets
CREATE POLICY "Pets: Ver todos" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Pets: Criar próprios" ON public.pets FOR INSERT WITH CHECK (true);
CREATE POLICY "Pets: Atualizar próprios" ON public.pets FOR UPDATE USING (true);
CREATE POLICY "Pets: Deletar próprios" ON public.pets FOR DELETE USING (true);

-- Atendimentos
CREATE POLICY "Atendimentos: Ver todos" ON public.atendimentos FOR SELECT USING (true);
CREATE POLICY "Atendimentos: Criar" ON public.atendimentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Atendimentos: Atualizar" ON public.atendimentos FOR UPDATE USING (true);
CREATE POLICY "Atendimentos: Deletar" ON public.atendimentos FOR DELETE USING (true);

-- Atendimento_Servico
CREATE POLICY "AtendimentoServico: Ver todos" ON public.atendimento_servico FOR SELECT USING (true);
CREATE POLICY "AtendimentoServico: Criar" ON public.atendimento_servico FOR INSERT WITH CHECK (true);
CREATE POLICY "AtendimentoServico: Atualizar" ON public.atendimento_servico FOR UPDATE USING (true);
CREATE POLICY "AtendimentoServico: Deletar" ON public.atendimento_servico FOR DELETE USING (true);
