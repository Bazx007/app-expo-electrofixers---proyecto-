-- Ejecutar UNA VEZ en SQL Editor, en un proyecto nuevo.
begin;

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (length(trim(nombre)) > 0),
  categoria text not null check (length(trim(categoria)) > 0),
  precio numeric(12, 2) not null check (precio > 0),
  stock integer not null check (stock >= 0),
  created_at timestamptz not null default now()
);

-- Los administradores se asignan desde el Dashboard, nunca desde la app.
create table public.administradores (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.productos enable row level security;
alter table public.administradores enable row level security;

revoke all on public.productos from anon, authenticated;
revoke all on public.administradores from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.productos to anon, authenticated;
grant insert on public.productos to authenticated;
grant select on public.administradores to authenticated;

create policy "catalogo_publico" on public.productos
  for select to anon, authenticated using (true);

create policy "consultar_mi_rol" on public.administradores
  for select to authenticated using (user_id = (select auth.uid()));

create policy "alta_solo_administradores" on public.productos
  for insert to authenticated
  with check (
    exists (
      select 1 from public.administradores
      where user_id = (select auth.uid())
    )
  );

insert into public.productos (nombre, categoria, precio, stock) values
  ('Heladera Samsung', 'Electrodomésticos', 450000, 3),
  ('Microondas LG', 'Electrodomésticos', 80000, 5),
  ('Pantalla para celular', 'Repuestos', 32000, 8);
commit;
