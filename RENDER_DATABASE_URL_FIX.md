# 🔧 Render DATABASE_URL Fix

## Problem
The deployment was failing with:
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`.
```

## Root Cause
The `render.yaml` file had `DATABASE_URL` set with `sync: false`, which required manual configuration in the Render dashboard. The database connection wasn't being automatically linked.

## Solution Applied
Updated `render.yaml` to automatically link the database:

**Before:**
```yaml
- key: DATABASE_URL
  sync: false
  # Set this in Render dashboard: postgresql://user:pass@host:5432/accessibleos
```

**After:**
```yaml
- key: DATABASE_URL
  fromDatabase:
    name: accessibleos-db
    property: connectionString
```

Also updated the start command to run migrations automatically:
```yaml
startCommand: cd backend && npx prisma migrate deploy && npm start
```

## Next Steps

### Option 1: If Database Already Exists in Render
1. Go to your Render dashboard
2. Find your `accessibleos-db` database service
3. Make sure the service name matches exactly: `accessibleos-db`
4. Commit and push the updated `render.yaml`:
   ```bash
   git add render.yaml
   git commit -m "Fix DATABASE_URL to auto-link from database service"
   git push
   ```
5. Render will automatically redeploy with the correct database URL

### Option 2: If Database Doesn't Exist Yet
1. Commit and push the updated `render.yaml`:
   ```bash
   git add render.yaml
   git commit -m "Fix DATABASE_URL to auto-link from database service"
   git push
   ```
2. Render will automatically create the database when deploying
3. The `DATABASE_URL` will be automatically injected

### Option 3: Manual Database Creation (If Needed)
If Render doesn't auto-create the database:

1. Go to Render dashboard → **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `accessibleos-db` (must match exactly)
   - **Database**: `accessibleos`
   - **User**: `accessibleos`
   - **Region**: `oregon` (or same as your service)
   - **Plan**: Free
3. Click **"Create Database"**
4. The web service will automatically pick up the connection string

## Verification

After deployment, check the logs:
- Should see: `Prisma schema loaded from prisma/schema.prisma`
- Should see: `Datasource "db": PostgreSQL database`
- Should see: `Applying migration...` (if migrations run)
- Should see: `Server running on port 10000`

## Troubleshooting

If you still see the error:

1. **Check Database Service Name**: Must be exactly `accessibleos-db` (case-sensitive)
2. **Check Database Status**: Database must be running (not paused)
3. **Check Region**: Database and service should be in the same region
4. **Manual Override**: If needed, you can manually set `DATABASE_URL` in Render dashboard:
   - Go to your web service → **Environment** tab
   - Add/Edit `DATABASE_URL`
   - Get the Internal Database URL from your database service
   - Format: `postgresql://user:password@host:5432/database`

## What Changed

- ✅ `render.yaml`: Updated `DATABASE_URL` to use `fromDatabase` reference
- ✅ `render.yaml`: Updated `startCommand` to run migrations automatically
- ✅ Database connection now automatically configured

The deployment should now work correctly! 🎉

