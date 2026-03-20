# 🚀 Deployment Guide - Task Board

This guide walks through deploying the Task Board application to Vercel (free tier).

## Prerequisites

- GitHub account with your repository pushed
- Supabase project created and configured
- Node.js 16+ installed locally

## Step 1: Prepare Your Repository

### Ensure Everything is Committed

```bash
cd task-board
git status
git add .
git commit -m "Task board: complete implementation with Supabase"
git push origin main
```

### Required Files

Ensure these files exist in your repo:
- `supabase_schema.sql` - Database schema
- `src/` - React source code
- `package.json` - Dependencies
- `.env.example` - Environment template
- `README.md` - Project documentation
- `SETUP_GUIDE.md` - Setup instructions

## Step 2: Verify Supabase Setup

### Database Schema
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the entire contents of `supabase_schema.sql`
4. Verify tables are created:
   - `tasks`
   - `labels`
   - `comments`
   - `activity_log`
   - `team_members`

### Get API Keys
1. Go to Settings → API
2. Copy your **Project URL** (looks like `https://xxx.supabase.co`)
3. Copy your **Project API Keys → anon public key** (looks like `eyJhbGciOi...`)
4. **Important**: Only use the anon key, never the service_role key

### Test RLS Locally
Before deploying, test that anonymous auth works:

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# App should auto-create a guest session
# Create a test task
# Verify it appears in Supabase dashboard
```

## Step 3: Deploy to Vercel

### Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up (can use GitHub login)
3. Click "New Project"

### Import Repository

1. In Vercel dashboard, click "New Project"
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"
5. Vercel will auto-detect it's a Vite + React project

### Configure Environment Variables

1. In the project settings, go to **Environment Variables**
2. Add two variables:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://your-project-id.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: Your anon key from Supabase

3. **Important**: Make sure these are available to:
   - Production
   - Preview
   - Development

### Deploy

1. Click "Deploy"
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Run `npm run build`
   - Deploy to a live URL

3. Wait for the deployment to complete (2-5 minutes)
4. You'll get a URL like `task-board-xyz.vercel.app`

## Step 4: Test Live Deployment

1. Click on your deployment URL
2. The app should load (might take 10-20 seconds first time)
3. Create a test task
4. Verify drag-and-drop works
5. Refresh the page - task should still be there
6. Open in incognito/private window - you should see different tasks (different guest user)

## Step 5: Enable Continuous Deployment

Vercel auto-deploys on every push to main. To test this:

```bash
# Make a small change
echo "// test" >> src/App.tsx

# Commit and push
git add .
git commit -m "Test deployment"
git push origin main

# Watch deployment progress in Vercel dashboard
# It should start auto-deploying
```

## Troubleshooting

### Deployment Fails
1. Check Vercel build logs for errors
2. Verify `npm run build` works locally:
   ```bash
   npm run build
   ```
3. Look for TypeScript or ESLint errors

### App Loads But Nothing Displays
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab - look for failed requests to Supabase
4. Verify environment variables are set in Vercel:
   - Go to Project Settings → Environment Variables
   - Ensure variables are listed

### Supabase Connection Error
1. Verify `VITE_SUPABASE_URL` is correct
2. Verify `VITE_SUPABASE_ANON_KEY` is correct
3. Check Supabase project is active (not paused)
4. Try the app from different network to rule out local issues

### Authentication Issues
1. In Supabase dashboard, go to SQL Editor
2. Run: `SELECT * FROM auth.users;`
3. You should see anonymous users being created
4. If not, check the browser console for errors

### RLS Policy Errors
If you see "new row violates row-level security policy":
1. Go to Supabase → SQL Editor
2. Run: `SELECT * FROM auth.users WHERE id = 'YOUR_USER_ID';`
3. Verify user exists
4. Check RLS policies:
   ```sql
   SELECT * FROM pg_policies 
   WHERE schemaname = 'public' AND tablename = 'tasks';
   ```

## Performance Optimization

### Vercel Deployment Settings
1. Go to Project Settings → Build & Development Settings
2. Optimize:
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
   - **Install Command**: `npm install` (default)

### CDN Caching
Vercel automatically serves static assets from CDN. For best performance:
- Images should be under 100KB
- CSS/JS are bundled and minified by Vite

## Domain Configuration (Optional)

To use your own domain:

1. Purchase domain (any registrar)
2. In Vercel project, go to Settings → Domains
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions
5. Wait for DNS to propagate (can take 24 hours)

Example domains:
- `taskboard.yourname.com`
- `tasks.example.com`

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Create a task
- [ ] Edit the task
- [ ] Delete the task
- [ ] Drag task between columns
- [ ] Refresh page - tasks persist
- [ ] Open in private/incognito window - different tasks shown
- [ ] Share live URL with others
- [ ] Test on mobile device

## Monitoring

### View Deployment Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click on a deployment to see logs

### Monitor Errors
1. Set up Sentry or similar error tracking (optional):
   ```bash
   npm install @sentry/react
   ```
2. Add error tracking to your app for production

### Performance Monitoring
- Vercel provides Web Vitals in Analytics
- Check in Project Settings → Analytics
- Monitor Core Web Vitals scores

## Rollback

If you push a broken deployment:

```bash
# Option 1: Fix and push again
git revert HEAD
git push origin main

# Option 2: Redeploy previous version
# In Vercel dashboard, go to Deployments
# Click the three dots on a previous good deployment
# Select "Redeploy"
```

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
git add package*.json
git commit -m "Update dependencies"
git push origin main
```

### Database Backups
- Supabase Free tier provides daily backups
- Go to Settings → Backups
- Can restore from backup if needed

## Next Steps

1. ✅ Deployment is live
2. Share your URL with others
3. Gather feedback on design and features
4. Consider adding advanced features:
   - Task comments
   - Team collaboration
   - Activity logs
   - Labels/tags
5. Scale up with Pro tier if needed

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**Your app is now live!** 🎉

Share your deployment URL and get feedback from users.
