# 🚀 Run Migrations - Quick Guide

## Your Supabase Password
`df5zZSZkzwccGVXR`

## Quick Steps

### 1. Get Supabase Connection String

From Supabase dashboard:
- Settings → Database → Connection pooling
- Copy URI
- Replace `[YOUR-PASSWORD]` with: `df5zZSZkzwccGVXR`

### 2. Update backend/.env

```env
DATABASE_URL="postgresql://postgres.[PROJECT]:df5zZSZkzwccGVXR@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

### 3. Run Migrations

```bash
cd backend
npm run prisma:generate
npx prisma migrate deploy
```

### 4. Verify

Check Supabase dashboard → Table Editor → Should see `tasks` table!

---

**That's it!** Migrations run locally, pointing to Supabase. No Render shell needed!

