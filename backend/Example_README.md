SUPABASE MIGRATION – END TO END (STUDY GUIDE)
============================================

GOAL
----
Learn how to:
1. Write SQL locally
2. Push it to Supabase Cloud
3. See cloud database update automatically
4. Understand backend flow clearly


PREREQUISITES
-------------
- Node.js installed
- Supabase account
- Supabase Cloud project created


STEP 1: CREATE LOCAL BACKEND FOLDER
----------------------------------
```bash
mkdir backend
cd backend
npx supabase init
```
This creates:
backend/
└── supabase/
    ├── config.toml
    └── migrations/


STEP 2: LOGIN & LINK TO SUPABASE CLOUD
-------------------------------------

```bash
npx supabase login
npx supabase link

```
When prompted:
? Select a project:
→ choose your Supabase Cloud project
→ press Enter

This connects your local folder to the cloud project.

Check connection:
```
Open backend/supabase/config.toml
You should see a project_id.

```

STEP 3: CREATE A MIGRATION FILE
-------------------------------

npx supabase migration new products

This creates a file like:
```
supabase/migrations/2024xxxx_products.sql
```

THIS FILE IS YOUR BACKEND CODE.


STEP 4: WRITE SIMPLE SQL (EXAMPLE)
---------------------------------

Open the migration file and write:
```

create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric not null,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Public read products"
on products
for select
using (true);

```


STEP 5: PUSH SQL TO SUPABASE CLOUD
---------------------------------

npx supabase db push

What happens:
- Supabase CLI reads migration files
- Connects to Supabase Cloud
- Executes SQL
- Updates cloud database


STEP 6: VERIFY IN SUPABASE DASHBOARD
-----------------------------------

Go to:
Supabase Dashboard → Database → Tables

You will see:
products

The table was NOT created manually.
It came from your local SQL file.


STEP 7: CHANGE CLOUD BY CHANGING FILE
------------------------------------

Create another migration:

npx supabase migration new add_description

Edit file:

alter table products
add column description text;

Push again:
```bash

npx supabase db push
```

Now the cloud table has a new column.


IMPORTANT RULES
---------------
- Never edit old migration files
- Always create a new migration
- Do not change database manually in dashboard
- Migration files = backend source of truth


MENTAL MODEL (REMEMBER THIS)
----------------------------
```
Local SQL file
      ↓
Supabase migration
      ↓
Supabase Cloud database
      ↓
Supabase auto-generated APIs
      ↓
Frontend can use APIs

```


FINAL CONFIRMATION
------------------

```
✓ SQL written locally
✓ Cloud updated automatically
✓ No manual DB edits
✓ This is real backend engineering
✓ This is how professionals work
```