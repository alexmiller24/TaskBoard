# ��� Task Board - Kanban-Style Task Management

A beautiful, fully-featured Kanban-style task board for managing work visually. Create tasks, drag them across board sections, and track progress in real-time — all without authentication.

**Live Demo:** https://task-board-2j7x.vercel.app/

## ✨ Features

- ��� **Drag-and-Drop Board** - Seamlessly move tasks between columns
- ��� **Rich Task Details** - Title, description, priority, due dates
- ��� **Guest Accounts** - No login required, automatic anonymous sessions
- ��� **Modern Design** - Clean, polished interface inspired by Asana and Linear
- ��� **Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Real-time Updates** - Instant feedback on all operations
- ��� **Secure** - Row Level Security ensures privacy
- ��� **Board Stats** - Track total, in-progress, and completed tasks

## ��� Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account (free tier)

### Setup

1. **Clone & Install**
```bash
git clone [your-repo]
cd task-board
npm install
```

2. **Configure Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase_schema.sql`
   - Copy your Project URL and Anon Key

3. **Environment Variables**
Create `.env.local`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run Locally**
```bash
npm run dev
```

Visit `http://localhost:5173`

## ��� Full Documentation

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup, architecture, and deployment instructions.

## ��� Tech Stack

- React 19 + TypeScript
- Supabase (PostgreSQL + Auth)
- @dnd-kit (Drag & Drop)
- Vite
- CSS 3

## ��� Database

Complete schema with RLS policies included. See `supabase_schema.sql` for:
- `tasks` table with title, description, priority, due_date
- `labels`, `comments`, `activity_log`, `team_members` for advanced features
- Full Row Level Security policies

## ��� How It Works

1. App loads → Auto-creates guest session via Supabase
2. Create task → Stored in database with your user_id
3. Drag task → Status updates immediately
4. Only you see your tasks (RLS protection)

## ��� Board Sections

- **To Do** - New tasks
- **In Progress** - Active work
- **In Review** - Waiting for approval
- **Done** - Completed tasks

## ��� Deploy to Vercel

```bash
git push origin main
# Connect repo to Vercel
# Add environment variables in Vercel dashboard
# Deploy!
```

## ��� Design Philosophy

- Clean, minimal interface
- Clear visual hierarchy
- Intentional color palette
- Smooth transitions and feedback
- Accessibility-first approach

## ��� License

Open source - MIT License

---

**Built with React, TypeScript, and Supabase** ❤️
