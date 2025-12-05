# 🔧 Running Migrations Without Render Shell (Free Tier)

## Problem

Render free tier doesn't support shell access, so you can't run `npx prisma migrate deploy` in the shell.

## ✅ Solution: Run Migrations Locally

Since you're using Supabase (external database), you can run migrations from your local machine!

---

## Step-by-Step: Run Migrations Locally

### Step 1: Get Your Supabase Connection String

1. Go to Supabase dashboard
2. Settings → Database
3. Copy the **Connection pooling** URI
4. Replace `[YOUR-PASSWORD]` with: `df5zZSZkzwccGVXR`

**Your connection string should look like:**
```
postgresql://postgres.[PROJECT-REF]:df5zZSZkzwccGVXR@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Step 2: Update Local .env

Update `backend/.env`:
```env
DATABASE_URL="[Your Supabase connection string with password]"
NODE_ENV=development
PORT=3000
```

### Step 3: Run Migrations Locally

```bash
cd /Users/ky/accessibleos/backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations against Supabase
npx prisma migrate deploy
```

### Step 4: Verify Migrations

Check if tables were created:
```bash
# List tables
npx prisma studio
# Or check Supabase dashboard → Table Editor
```

---

## ✅ Alternative: Auto-Run Migrations on Deploy

You can also modify the start command to run migrations automatically:

### Update Render Start Command

In Render dashboard, change **Start Command** to:

```bash
npx prisma migrate deploy && npm start
```

This will:
1. Run migrations before starting
2. Then start the server
3. Works on free tier!

**⚠️ Note:** This runs migrations on every deploy. Usually fine, but be aware.

---

## 🎯 Recommended Approach

**Option 1: Run Locally (Best)**
- Run migrations once from your machine
- Point to Supabase database
- Simple and works perfectly

**Option 2: Auto-Run on Deploy**
- Modify start command in Render
- Migrations run automatically
- Convenient but runs every deploy

---

## 📝 Quick Commands

### Run Migrations Locally

```bash
cd backend

# Update .env with Supabase connection string
# Then:

npm run prisma:generate
npx prisma migrate deploy
```

### Verify in Supabase

1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. You should see `tasks` table

---

## 🆘 Troubleshooting

### Connection Fails

- ✅ Verify password is correct: `df5zZSZkzwccGVXR`
- ✅ Check connection string format
- ✅ Make sure you're using Connection Pooling string
- ✅ Verify Supabase project is active

### Migrations Fail

- ✅ Check Prisma schema matches Supabase
- ✅ Verify DATABASE_URL in .env is correct
- ✅ Run `npm run prisma:generate` first

---

## ✅ After Migrations

Once migrations are done:
- ✅ Tables created in Supabase
- ✅ Backend can connect and work
- ✅ You can create tasks from web app

**No shell needed!** 🎉

