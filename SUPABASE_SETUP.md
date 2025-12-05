# 🚀 Supabase Setup Guide for AccessibleOS

## Quick Setup Steps

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (recommended) or email
4. Once logged in, click **"New Project"**
5. Fill in:
   - **Name**: `accessibleos` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free (default)
6. Click **"Create new project"**
7. Wait 1-2 minutes for project to initialize

### Step 2: Get Connection String

1. Once project is ready, go to **Settings** (gear icon in sidebar)
2. Click **"Database"** in settings menu
3. Scroll down to **"Connection string"** section
4. Click **"Connection pooling"** tab
5. Copy the **"URI"** connection string
   - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

**⚠️ Important:** Replace `[YOUR-PASSWORD]` with the password you created in Step 1!

**Full connection string format:**
```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Step 3: Test Connection Locally (Optional)

Update your local `backend/.env`:
```env
DATABASE_URL="[Paste your Supabase connection string here]"
```

Test it:
```bash
cd backend
npm run prisma:generate
npx prisma migrate deploy
```

### Step 4: Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `KyPython/AccessibleOS`
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
5. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = `[Your Supabase connection string from Step 2]`
6. Click **"Create Web Service"**

### Step 5: Run Database Migrations

After backend deploys (takes ~5 minutes):

1. Go to your backend service in Render dashboard
2. Click **"Shell"** tab
3. Run:
   ```bash
   npx prisma migrate deploy
   ```
4. Wait for migrations to complete

### Step 6: Deploy Web App to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import GitHub repository: `KyPython/AccessibleOS`
4. Configure:
   - **Root Directory**: `web`
   - **Framework Preset**: Vite (auto-detected)
5. **Environment Variables:**
   - `VITE_API_URL` = `https://accessibleos-backend.onrender.com/api`
   - (Use your actual Render backend URL)
6. Click **"Deploy"**

---

## ✅ Verify Everything Works

### Test Backend
```bash
curl https://accessibleos-backend.onrender.com/health
# Should return: {"status":"ok","message":"AccessibleOS API is running"}
```

### Test Database Connection
```bash
curl https://accessibleos-backend.onrender.com/api/tasks
# Should return: {"data":[]} (empty array is fine - no tasks yet)
```

### Test Web App
- Open your Vercel URL in browser
- Try creating a task
- Check if it saves (check backend logs if issues)

---

## 🔐 Security Notes

### Keep Your Password Safe

- ✅ Store password in password manager
- ✅ Never commit `.env` files
- ✅ Use environment variables in Render/Vercel

### Connection String Types

Supabase offers two connection strings:

1. **Session Mode** (default):
   - Use for: Migrations, admin tasks
   - Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

2. **Connection Pooling** (recommended for apps):
   - Use for: Production applications
   - Format: `postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Better for**: Multiple concurrent connections
   - **Use this one for Render deployment!**

---

## 📊 Supabase Dashboard Features

Once set up, you can use Supabase dashboard for:

- **Table Editor**: View/edit data directly
- **SQL Editor**: Run SQL queries
- **API Docs**: Auto-generated API documentation
- **Logs**: Monitor queries and errors
- **Auth**: User management (if you add auth later)

---

## 🎯 Next Steps

After deployment:

1. ✅ Test creating tasks from web app
2. ✅ Verify data appears in Supabase dashboard
3. ✅ Check backend logs for any errors
4. ✅ Set up monitoring (optional)

---

## 🆘 Troubleshooting

### Connection Issues

**Problem**: Can't connect to database
- ✅ Verify password is correct in connection string
- ✅ Check you're using Connection Pooling string for production
- ✅ Verify project is active in Supabase dashboard

### Migration Issues

**Problem**: Migrations fail
- ✅ Check connection string is correct
- ✅ Verify database is ready (wait 2-3 min after creation)
- ✅ Run migrations in Render Shell (not local)

### API Not Working

**Problem**: Backend can't reach database
- ✅ Check `DATABASE_URL` in Render environment variables
- ✅ Verify connection string format
- ✅ Check Render logs for errors

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] Backend deployed to Render
- [ ] Database migrations run successfully
- [ ] Web app deployed to Vercel
- [ ] API URL configured in Vercel
- [ ] Test task creation works
- [ ] Data appears in Supabase dashboard

---

**Ready to start?** Follow the steps above and you'll be live in ~15 minutes! 🚀

