# 🚀 Deployment Guide - Using Supabase

## Overview

This guide covers deploying AccessibleOS with **Supabase** as the database (better than Render's free tier limit!).

**Services:**
- **Supabase** - PostgreSQL Database (free tier)
- **Render** - Backend API (Node.js/Express)
- **Vercel** - Web Application (React/Vite)

---

## 📋 Prerequisites

1. ✅ Code pushed to GitHub: `https://github.com/KyPython/AccessibleOS`
2. ✅ GitHub account
3. ✅ Supabase account (free) - [supabase.com](https://supabase.com)
4. ✅ Render account (free) - [render.com](https://render.com)
5. ✅ Vercel account (free) - [vercel.com](https://vercel.com)

---

## 1️⃣ Setup Supabase Database

### Create Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `accessibleos`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create new project"**
5. Wait 1-2 minutes for initialization

### Get Connection String

1. In Supabase dashboard, go to **Settings** (⚙️) → **Database**
2. Scroll to **"Connection string"** section
3. Click **"Connection pooling"** tab
4. Copy the **URI** connection string
5. **Replace `[YOUR-PASSWORD]`** with your actual password

**Connection string looks like:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**⚠️ Save this connection string!** You'll need it for Render.

---

## 2️⃣ Deploy Backend to Render

### Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account (if not already)
4. Select repository: `KyPython/AccessibleOS`
5. Click **"Connect"**

### Configure Service

Fill in these settings:

- **Name**: `accessibleos-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: 
  ```bash
  npm install && npm run prisma:generate && npm run build
  ```
- **Start Command**: 
  ```bash
  npm start
  ```
- **Plan**: Free

### Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | `[Your Supabase connection string]` |

**⚠️ Important:** Use the **Connection Pooling** string from Supabase!

### Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (~5 minutes)
3. Your backend will be at: `https://accessibleos-backend.onrender.com`

### Run Database Migrations

After deployment completes:

1. Go to your backend service in Render
2. Click **"Shell"** tab (or "Logs" → "Shell")
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Wait for migrations to complete
5. Verify: Check logs for "Migration applied" messages

### Test Backend

```bash
# Health check
curl https://accessibleos-backend.onrender.com/health

# Should return:
# {"status":"ok","message":"AccessibleOS API is running"}
```

---

## 3️⃣ Deploy Web App to Vercel

### Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select `KyPython/AccessibleOS`
5. Click **"Import"**

### Configure Project

- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `web`
- **Build Command**: `npm run build` (auto)
- **Output Directory**: `dist` (auto)
- **Install Command**: `npm install` (auto)

### Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://accessibleos-backend.onrender.com/api` |

**⚠️ Use your actual Render backend URL!**

### Deploy

1. Click **"Deploy"**
2. Wait for build (~2-3 minutes)
3. Your app will be at: `https://accessibleos-[random].vercel.app`

### Update Environment Variable (If Backend URL Changes)

If your backend URL is different:
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Update `VITE_API_URL` with correct backend URL
3. Click **"Redeploy"** or it will auto-redeploy

---

## 4️⃣ Verify Everything Works

### Test Backend API

```bash
# Health check
curl https://accessibleos-backend.onrender.com/health

# Get tasks (should be empty array initially)
curl https://accessibleos-backend.onrender.com/api/tasks
```

### Test Web App

1. Open your Vercel URL in browser
2. Try creating a task
3. Check if it appears in the list
4. Check browser console for errors

### Verify Database

1. Go to Supabase dashboard
2. Click **"Table Editor"** in sidebar
3. You should see the `tasks` table
4. Create a task from web app and verify it appears here!

---

## 🔧 Troubleshooting

### Backend Deployment Issues

**Problem**: Build fails
- ✅ Check Render logs for errors
- ✅ Verify Node.js version (should be 18+)
- ✅ Check build command is correct

**Problem**: Database connection fails
- ✅ Verify `DATABASE_URL` is correct in Render
- ✅ Check you're using Connection Pooling string
- ✅ Verify password is correct in connection string
- ✅ Check Supabase project is active

**Problem**: Migrations fail
- ✅ Run migrations in Render Shell (not local)
- ✅ Check connection string format
- ✅ Verify database is ready (wait 2-3 min after creation)

### Web App Issues

**Problem**: Can't connect to API
- ✅ Verify `VITE_API_URL` is correct
- ✅ Check backend is running (health check)
- ✅ Check browser console for CORS errors
- ✅ Verify backend URL includes `/api` path

**Problem**: Build fails
- ✅ Check Vercel build logs
- ✅ Verify all dependencies in `package.json`
- ✅ Check for TypeScript errors

---

## 📊 Service URLs

After deployment, you'll have:

- **Backend API**: `https://accessibleos-backend.onrender.com`
- **Web App**: `https://accessibleos-[random].vercel.app`
- **Database**: Managed by Supabase (access via dashboard)

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed and healthy
- [ ] Database migrations completed
- [ ] Web app deployed and accessible
- [ ] API URL configured in Vercel
- [ ] Can create tasks from web app
- [ ] Tasks appear in Supabase dashboard
- [ ] No errors in browser console
- [ ] Backend logs show successful requests

---

## 🚀 Automatic Deployments

Both platforms support auto-deployment:

- **Render**: Auto-deploys on push to `main` branch
- **Vercel**: Auto-deploys on push to connected branch

Just push to GitHub and everything updates automatically!

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

## 🎉 Success!

Your AccessibleOS app is now live with:
- ✅ Supabase PostgreSQL database
- ✅ Render backend API
- ✅ Vercel web application

**Everything is deployed and ready to use!** 🚀

---

**Need help?** Check troubleshooting section or see `SUPABASE_SETUP.md` for detailed setup steps.

