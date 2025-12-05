# 🚀 AccessibleOS Quick Start Guide

## ✅ Dependencies Installed!

All npm packages have been successfully installed. You're ready to start development!

## Next Steps

### Option 1: Start Development Servers

#### Start Backend (Terminal 1)
```bash
cd backend
# First, create .env file (see below)
npm run dev
```

**Backend runs on**: http://localhost:3000

#### Start Web App (Terminal 2)
```bash
cd web
npm run dev
```

**Web app runs on**: http://localhost:5173

### Option 2: Set Up Database First

Before starting the backend, you need to:

1. **Install PostgreSQL** (if not already installed)
   - macOS: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from postgresql.org

2. **Create Database**
   ```bash
   createdb accessibleos
   ```

3. **Create Backend .env File**
   ```bash
   cd backend
   ```
   
   Create a file named `.env` with:
   ```
   DATABASE_URL="postgresql://your_username:your_password@localhost:5432/accessibleos?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

4. **Run Prisma Migrations**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start Backend**
   ```bash
   npm run dev
   ```

### Option 3: Run Tests

#### Backend Tests
```bash
cd backend
npm test
```

#### Web Tests
```bash
cd web
npm test
```

#### All Tests
```bash
npm run test:all
```

## Quick Commands Reference

### From Root Directory

```bash
# Install all dependencies
npm run install:all

# Run all tests
npm run test:all

# Start backend
npm run dev:backend

# Start web app
npm run dev:web

# Build backend
npm run build:backend

# Build web app
npm run build:web
```

### Individual Platform Commands

#### Backend
```bash
cd backend
npm run dev          # Start dev server
npm test            # Run tests
npm run build       # Build for production
npm run prisma:studio  # Open database GUI
```

#### Web
```bash
cd web
npm run dev         # Start dev server
npm test           # Run tests
npm run build      # Build for production
npm run preview    # Preview production build
```

#### Mobile
```bash
cd mobile
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
```

## Development Workflow

1. **Start Backend** (requires database setup)
2. **Start Web App** (can run without backend, but API calls will fail)
3. **Open Browser** to http://localhost:5173
4. **Start Coding!**

## Troubleshooting

### Backend Won't Start
- Check if PostgreSQL is running: `pg_isready`
- Verify `.env` file exists and has correct DATABASE_URL
- Run `npm run prisma:generate` if you see Prisma errors

### Web App Won't Start
- Check if port 5173 is available
- Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` matches your PostgreSQL setup
- Ensure database `accessibleos` exists

## What's Next?

### Phase 2: Backend & Unity Foundation (Weeks 3-5)
- Complete backend features
- Add authentication
- Unity Input System integration
- Screen reader integration hooks

### Or Start Custom Development
- Add new features
- Customize components
- Extend accessibility features
- Add new API endpoints

## Need Help?

- See `docs/architecture.md` for system design
- See `docs/timeline.md` for project phases
- See platform-specific READMEs for detailed setup
- See `SETUP_CHECKLIST.md` for verification steps

---

**Ready to code!** 🎉

