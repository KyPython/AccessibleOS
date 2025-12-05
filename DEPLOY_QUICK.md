# 🚀 Quick Deployment - Free Tier Solution

## ⚠️ Render Database Limit Issue

Render free tier only allows **one database**. Here's the fastest solution:

---

## ✅ Solution: Use Neon (Free PostgreSQL)

**Neon allows multiple free databases** - perfect for this situation!

### Step 1: Create Neon Database (2 minutes)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free, no credit card)
3. Click **"Create Project"**
4. Name: `accessibleos`
5. Click **"Create Project"**
6. **Copy the connection string** from the dashboard

### Step 2: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. **"New +"** → **"Web Service"** (NOT database!)
3. Connect your GitHub repo: `https://github.com/KyPython/AccessibleOS`
4. Configure:
   - **Name**: `accessibleos-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && npm run prisma:generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `[Paste Neon connection string here]`
6. Click **"Create Web Service"**

### Step 3: Run Database Migrations

After backend deploys:
1. Go to your backend service in Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Step 4: Deploy Web App to Vercel

1. Go to [vercel.com](https://vercel.com)
2. **"Add New"** → **"Project"**
3. Import GitHub repo: `KyPython/AccessibleOS`
4. Configure:
   - **Root Directory**: `web`
   - **Framework**: Vite (auto-detected)
5. Add Environment Variable:
   - `VITE_API_URL` = `https://accessibleos-backend.onrender.com/api`
6. Click **"Deploy"**

---

## ✅ Done!

- **Backend**: `https://accessibleos-backend.onrender.com`
- **Web App**: `https://your-app.vercel.app`
- **Database**: Neon (free, multiple allowed!)

---

## 🎯 Alternative: Wait for Your Other Workspace

If you prefer to wait:
- Use your existing Render database connection string
- Skip Neon setup
- Just update `DATABASE_URL` in Render backend service

---

**Need help?** See `DEPLOYMENT_FREE_TIER.md` for more options!

