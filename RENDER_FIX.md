# 🔧 Render Deployment Fix

## Problem

Render is looking for `/opt/render/project/src/backend/dist/index.js` but the file is at `dist/index.js` relative to the backend directory.

## ✅ Solution: Fix Start Command

In Render dashboard, update the **Start Command**:

### Current (Wrong):
```bash
npm start
```

### Fixed:
```bash
cd backend && npm start
```

**OR** if Root Directory is already set to `backend`:

```bash
node dist/index.js
```

---

## 📝 Render Configuration

Make sure these settings are correct:

- **Root Directory**: `backend` ✅
- **Build Command**: `npm install && npm run prisma:generate && npm run build` ✅
- **Start Command**: `node dist/index.js` ✅ (if Root Directory is `backend`)

**OR** if Root Directory is empty/root:

- **Root Directory**: (empty or `/`)
- **Build Command**: `cd backend && npm install && npm run prisma:generate && npm run build`
- **Start Command**: `cd backend && node dist/index.js`

---

## 🎯 Quick Fix

Go to Render dashboard → Your backend service → Settings:

1. Check **Root Directory** is set to: `backend`
2. Update **Start Command** to: `node dist/index.js`
3. Save and redeploy

---

This should fix the module not found error!

