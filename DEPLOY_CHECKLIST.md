# 🚀 Deployment Checklist

## ✅ Ready for Deployment!

All deployment configurations are ready. Follow these steps:

---

## 📦 Step 1: Push to GitHub

### Create Repository & Push

```bash
cd /Users/ky/accessibleos

# 1. Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/accessibleos.git

# 2. Push code
git branch -M main
git push -u origin main
```

**See `GITHUB_SETUP.md` for detailed instructions.**

---

## 🗄️ Step 2: Deploy Backend to Render

### Setup Database

1. Go to [render.com](https://render.com) → **"New +"** → **"PostgreSQL"**
   - Name: `accessibleos-db`
   - Plan: Free
   - Region: Oregon (or closest)
   - Click **"Create Database"**

2. **Copy the Internal Database URL** (you'll need this!)

### Deploy Backend Service

1. **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `accessibleos-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: 
     ```bash
     npm install && npm run prisma:generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `[Your Database Internal URL from step above]`
5. Click **"Create Web Service"**

### Run Migrations

After deployment, in Render dashboard:
1. Go to your backend service
2. Click **"Shell"** tab
3. Run: `npx prisma migrate deploy`

**Your backend URL**: `https://accessibleos-backend.onrender.com`

---

## 🌐 Step 3: Deploy Web App to Vercel

### Import Project

1. Go to [vercel.com](https://vercel.com) → **"Add New"** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)

### Environment Variables

Add:
- `VITE_API_URL` = `https://accessibleos-backend.onrender.com/api`

*(Use your actual Render backend URL)*

4. Click **"Deploy"**

**Your web app URL**: `https://accessibleos-[random].vercel.app`

---

## ✅ Step 4: Verify Deployment

### Test Backend
```bash
curl https://accessibleos-backend.onrender.com/health
# Should return: {"status":"ok",...}
```

### Test Web App
- Open your Vercel URL in browser
- Try creating a task
- Check browser console for errors

---

## 🔧 Quick Commands

### If You Need to Redeploy

**Render (Backend):**
- Auto-deploys on git push to `main`
- Or click **"Manual Deploy"** in dashboard

**Vercel (Web):**
- Auto-deploys on git push
- Or trigger redeploy in dashboard

### Update Environment Variables

**Render:**
- Settings → Environment Variables → Edit

**Vercel:**
- Settings → Environment Variables → Edit
- Redeploy after changes

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render database created
- [ ] Backend deployed to Render
- [ ] Database migrations run
- [ ] Backend health check working
- [ ] Web app deployed to Vercel
- [ ] API URL configured in Vercel
- [ ] Test task creation from web app
- [ ] Everything working! 🎉

---

## 🆘 Troubleshooting

### Backend Issues
- Check Render logs
- Verify DATABASE_URL is Internal URL
- Run migrations in Render shell

### Web App Issues
- Check Vercel build logs
- Verify VITE_API_URL is correct
- Check browser console for errors

### CORS Errors
- Backend CORS is already configured
- If issues, check backend logs

---

## 📚 Documentation

- **Full Guide**: See `DEPLOYMENT.md`
- **GitHub Setup**: See `GITHUB_SETUP.md`
- **Architecture**: See `docs/architecture.md`

---

## 🎉 Success!

Once deployed, you'll have:

✅ **Backend**: `https://accessibleos-backend.onrender.com`  
✅ **Web App**: `https://your-app.vercel.app`  
✅ **Auto-deployments** on git push  

**Your app is live!** 🚀

