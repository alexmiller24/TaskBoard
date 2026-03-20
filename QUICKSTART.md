# 🚀 Quick Start Guide

Get the Task Board running in 5 minutes!

## Prerequisites

- Node.js 16+ ([download](https://nodejs.org))
- npm (comes with Node.js)
- A [Supabase account](https://supabase.com) (free)

## 1. Clone & Install (2 min)

```bash
git clone [YOUR-REPO-URL]
cd task-board
npm install
```

## 2. Create Supabase Project (1 min)

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to initialize
5. Go to Settings → API and copy:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon key** (VITE_SUPABASE_ANON_KEY)

## 3. Set Up Database (1 min)

1. In Supabase, go to SQL Editor
2. Copy entire contents of `supabase_schema.sql`
3. Paste into SQL editor
4. Click "Run"
5. Wait for success message

## 4. Add API Keys (30 sec)

Create `.env.local` in project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**Don't have the keys?** Go to Supabase → Settings → API

## 5. Run Locally (30 sec)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

That's it! You should see the Task Board. 🎉

---

## Next Steps

### ✅ Test It Out
- Click "+ New Task"
- Create a task with title and priority
- Drag it to different columns
- Refresh the page - task still there!

### 📱 Test on Mobile
- Open same URL on your phone
- Verify it works and looks good

### 🚀 Deploy to Vercel
See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

### 📚 Learn More
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
- [ASSESSMENT.md](./ASSESSMENT.md) - Technical details
- [README.md](./README.md) - Project overview

---

## Troubleshooting

**"Cannot find module" errors?**
```bash
npm install
npm run build
```

**Supabase connection error?**
- Double-check `.env.local` has correct URL and key
- Make sure Supabase project is active (not paused)
- Try clearing browser cache

**Drag-and-drop not working?**
- Try a different browser (Chrome, Firefox)
- Disable browser extensions
- Check console (F12) for JavaScript errors

**Still stuck?**
1. Check [Supabase docs](https://supabase.com/docs)
2. Check [React docs](https://react.dev)
3. Open an issue on GitHub

---

## What You Get

✅ Beautiful Kanban board  
✅ Drag-and-drop tasks  
✅ Guest accounts (no login)  
✅ Priority levels (Low, Normal, High)  
✅ Due date tracking  
✅ Board statistics  
✅ Secure database with RLS  
✅ Production-ready code  

---

**Estimated Time: 5 minutes** ⏱️

Let's build something great! 💪
