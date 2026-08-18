-- GZeed real multi-tenant migration
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).

-- 1) Link each store to the merchant account that owns it.
--    Needed so login can find "my store" instead of everyone sharing one
--    browser-local "latest_saved_store" fallback.
alter table public.stores
  add column if not exists owner_id uuid references auth.users(id);

create index if not exists stores_owner_id_idx on public.stores(owner_id);

-- 2) Real customer accounts for live storefronts (referenced by AuthForm.tsx,
--    which already calls this table but it doesn't exist yet).
create table if not exists public.store_customers (
  id uuid primary key references auth.users(id) on delete cascade,
  store_domain text not null,
  name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists store_customers_domain_idx on public.store_customers(store_domain);

-- 3) Real e-commerce orders (separate from `commandes`, which is the
--    factory/production workflow table and has no relation to storefront
--    checkout - it has no store_domain, items, or shipping fields at all).
create table if not exists public.store_orders (
  id uuid primary key default gen_random_uuid(),
  store_domain text not null,
  customer_id uuid references auth.users(id),
  customer_name text not null,
  phone text not null,
  city text,
  address text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  payment_method text not null default 'cod',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists store_orders_domain_idx on public.store_orders(store_domain);

-- Row Level Security -----------------------------------------------------

alter table public.stores enable row level security;
alter table public.store_customers enable row level security;
alter table public.store_orders enable row level security;

-- Merchants can read/update only the store(s) they own.
drop policy if exists "Owners manage their own store" on public.stores;
create policy "Owners manage their own store"
  on public.stores for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Live storefronts still need public read access to resolve a store by
-- domain (anonymous visitors browsing the shop, not just the owner).
drop policy if exists "Public can read stores by domain" on public.stores;
create policy "Public can read stores by domain"
  on public.stores for select
  using (true);

-- Customers manage only their own storefront account.
drop policy if exists "Customers manage their own profile" on public.store_customers;
create policy "Customers manage their own profile"
  on public.store_customers for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Checkout is guest-friendly (no login required to place a COD order).
drop policy if exists "Anyone can place an order" on public.store_orders;
create policy "Anyone can place an order"
  on public.store_orders for insert
  with check (true);

-- Only the store's owner can view/manage its orders.
drop policy if exists "Owners manage their store orders" on public.store_orders;
create policy "Owners manage their store orders"
  on public.store_orders for select
  using (
    store_domain in (select domain from public.stores where owner_id = auth.uid())
  );

drop policy if exists "Owners update their store orders" on public.store_orders;
create policy "Owners update their store orders"
  on public.store_orders for update
  using (
    store_domain in (select domain from public.stores where owner_id = auth.uid())
  );
