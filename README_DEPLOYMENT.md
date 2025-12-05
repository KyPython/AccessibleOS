# 🚀 Quick Deployment Guide

## Ready to Deploy!

All deployment configurations are in place. Follow these 3 simple steps:

---

## 1️⃣ Push to GitHub

```bash
# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/accessibleos.git
git branch -M main
git push -u origin main
```

📖 **Details**: See `GITHUB_SETUP.md`

---

## 2️⃣ Deploy Backend to Render

1. **Create PostgreSQL Database** on [render.com](https://render.com)
   - Name: `accessibleos-db`
   - Plan: Free

2. **Create Web Service**
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `npm install && npm run prisma:generate && npm run build`
   - Start: `npm start`
   - Set `DATABASE_URL` to Internal Database URL

3. **Run migrations** in Render Shell:
   ```bash
   npx prisma migrate deploy
   ```

📖 **Details**: See `DEPLOYMENT.md`

---

## 3️⃣ Deploy Web App to Vercel

1. **Import GitHub repo** on [vercel.com](https://vercel.com)
2. **Root Directory**: `web`
3. **Add Environment Variable**:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. **Deploy!**

📖 **Details**: See `DEPLOYMENT.md`

---

## ✅ Done!

Your app will be live at:
- **Backend**: `https://accessibleos-backend.onrender.com`
- **Web App**: `https://your-app.vercel.app`

---

## 📋 Quick Checklist

- [ ] Push to GitHub
- [ ] Deploy backend to Render
- [ ] Deploy web app to Vercel
- [ ] Test both deployments

**See `DEPLOY_CHECKLIST.md` for detailed steps!**

