# Running Seed Data in Supabase

## Prerequisites

1. **Schema must be created first** - Run `schema.sql` in Supabase SQL Editor if you haven't already
2. **Test user must exist** - The seed references user UUID `48e20a60-7047-4708-8523-30b6f3bfe427` (leon.cena@tum.de)

## Steps

### Option 1: If the user already exists in auth.users

1. Open Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy and paste the entire contents of `seed.sql`
4. Click "Run" or press Cmd/Ctrl + Enter
5. The seed will create:
   - Sample stores
   - Sample farms
   - Sample products with all related data
   - Producer profile for the test user
   - Demo farm for the test user

### Option 2: If the user doesn't exist yet

You have two options:

**A) Skip the producer profile section:**

Remove or comment out lines 568-590 in `seed.sql` before running it.

**B) Create the user first, then run seed:**

1. Sign up/login as `leon.cena@tum.de` in your app first
2. Get the user's UUID from `auth.users` table in Supabase
3. Update the UUID in `seed.sql` line 572 to match your actual user UUID
4. Then run the seed file

### Option 3: Check if user exists before seeding

Run this query first to check if the user exists:

```sql
SELECT id, email FROM auth.users WHERE id = '48e20a60-7047-4708-8523-30b6f3bfe427';
```

If no user exists, either:
- Create the user via your app's signup flow, OR
- Skip the producer profile section in the seed (lines 568-590)

## What the seed creates

- 3 sample stores (Auchan, Continente, Pingo Doce in Lisbon)
- 3 sample farms (Quinta do Sol, GreenHouse Westland, Sole di Campania)
- Sample products (Cluster Tomatoes, Cherry Tomatoes, Roma Tomatoes) with:
  - Product labels
  - Quality indicators
  - Supply chain ledger (VegiChain blocks)
  - Certification ledger
  - Farming practices
  - Farmer stories
  - Recipes
- Producer profile for test user (if user exists)
- Demo farm for test user (if user exists)

## Troubleshooting

- **Error: relation "farms" does not exist** → Run `schema.sql` first
- **Error: ON CONFLICT requires a unique constraint** → Schema might be missing unique constraints, check schema.sql ran completely
- **Warning: User not found** → Producer profile insertion will be skipped due to `ON CONFLICT DO NOTHING`, this is okay

