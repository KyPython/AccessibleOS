# 🚀 Deployment Guide

## Overview

This guide covers deploying AccessibleOS to:
- **Vercel** - Web application (React/Vite)
- **Render** - Backend API (Node.js/Express)

---

## 📋 Prerequisites

1. **GitHub Account** - For code repository
2. **Vercel Account** - Free tier available at [vercel.com](https://vercel.com)
3. **Render Account** - Free tier available at [render.com](https://render.com)
4. **Git Repository** - Code pushed to GitHub

---

## 1️⃣ GitHub Setup

### Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
   - Name: `accessibleos` (or your preferred name)
   - Description: "AccessibleOS - Accessible Task Management App"
   - Visibility: Public or Private
   - **Don't** initialize with README (we already have one)

2. Push your code:
   ```bash
   cd /Users/ky/accessibleos
   
   # Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

### Verify Push

Check your GitHub repository - you should see all files!

---

## 2️⃣ Render Deployment (Backend API)

### Step 1: Create PostgreSQL Database

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `accessibleos-db`
   - **Database**: `accessibleos`
   - **User**: `accessibleos`
   - **Region**: Choose closest (Oregon recommended)
   - **Plan**: Free
4. Click **"Create Database"**
5. **Important**: Copy the **Internal Database URL** (we'll need this)

### Step 2: Create Web Service (Backend)

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `accessibleos-backend`
   - **Region**: Same as database
   - **Branch**: `main`
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

### Step 3: Environment Variables

In the Render service settings, add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render's default port |
| `DATABASE_URL` | `[Your Database URL]` | From Step 1 - Internal Database URL |

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy your backend
3. Wait for deployment to complete (~5 minutes)

### Step 5: Run Database Migrations

After deployment:

1. Go to your backend service in Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```

### Your Backend URL

After deployment, your backend will be at:
```
https://accessibleos-backend.onrender.com
```

**Note**: Update this URL in your web app environment variables!

---

## 3️⃣ Vercel Deployment (Web App)

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Select the repository

### Step 2: Configure Project

1. **Framework Preset**: Vite
2. **Root Directory**: `web`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `dist` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Step 3: Environment Variables

Add these environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://accessibleos-backend.onrender.com/api` |

**Important**: Use your actual Render backend URL from Step 2!

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live!

### Your Web App URL

After deployment, your web app will be at:
```
https://accessibleos-[random].vercel.app
```

You can add a custom domain later in Vercel settings.

---

## 4️⃣ Update API URL

### Update Web App Environment

After backend is deployed, update the web app's environment variable:

1. Go to Vercel Dashboard
2. Select your web project
3. Go to **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to your Render backend URL:
   ```
   https://accessibleos-backend.onrender.com/api
   ```
5. Redeploy (will auto-redeploy or trigger manually)

### Or Update Locally

Update `web/.env`:
```env
VITE_API_URL=https://accessibleos-backend.onrender.com/api
```

Commit and push:
```bash
git add web/.env
git commit -m "Update API URL for production"
git push
```

---

## 5️⃣ Enable CORS (Backend)

The backend needs to allow requests from Vercel. Update `backend/src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}));
```

Or for all origins (development):
```typescript
app.use(cors());
```

---

## 6️⃣ Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Database migrations run
- [ ] Backend health check working
- [ ] Web app deployed to Vercel
- [ ] API URL configured in Vercel
- [ ] CORS configured in backend
- [ ] Test creating a task from web app
- [ ] Verify all endpoints working

---

## 🔧 Troubleshooting

### Backend Issues

**Build Fails:**
- Check Node.js version in Render (should be 18+)
- Verify `package.json` has correct build script
- Check build logs in Render dashboard

**Database Connection Issues:**
- Verify `DATABASE_URL` uses Internal Database URL
- Check database is running
- Run migrations in Render shell

**API Not Responding:**
- Check health endpoint: `https://your-backend.onrender.com/health`
- Verify PORT is set to 10000
- Check Render service logs

### Web App Issues

**Build Fails:**
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Check for TypeScript errors

**API Calls Fail:**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Check browser console for errors

**404 on Refresh:**
- Vercel should handle this automatically with `vercel.json`
- Check rewrite rules are correct

---

## 📊 Monitoring

### Render

- **Logs**: View in Render dashboard
- **Metrics**: Free tier includes basic metrics
- **Uptime**: Monitor service status

### Vercel

- **Analytics**: Available in dashboard
- **Logs**: View build and runtime logs
- **Performance**: Built-in analytics

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- **Render**: Auto-deploys on push to `main` branch
- **Vercel**: Auto-deploys on push to connected branch

Just push to GitHub and deployments happen automatically!

---

## 💰 Costs

### Free Tier Limits

**Render:**
- 750 hours/month (enough for always-on service)
- PostgreSQL: 90 days retention
- Spin down after 15 min inactivity (free tier)

**Vercel:**
- Unlimited deployments
- 100GB bandwidth
- Custom domains

### Tips

- Free tier is sufficient for development
- Render services spin down after inactivity (may take ~30s to wake up)
- Consider upgrading for production workloads

---

## 🎉 Success!

After completing all steps, you'll have:

- ✅ Backend API: `https://accessibleos-backend.onrender.com`
- ✅ Web App: `https://your-app.vercel.app`
- ✅ Database: Managed PostgreSQL on Render
- ✅ Automatic deployments on git push

**Your app is live!** 🚀

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Need Help?** Check the troubleshooting section or platform documentation.

