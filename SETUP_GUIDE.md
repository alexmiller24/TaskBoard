# 📋 Task Board - Kanban-Style Task Management App

A beautiful, fully-featured Kanban-style task board built with React, TypeScript, and Supabase. Drag tasks across board sections, manage work visually, and track progress in real-time.

**Live Demo:** [Deploy to Vercel - URL will be added after deployment]

**GitHub Repository:** [Add your GitHub link]

---

## Features

### Core Features ✨
- **Drag-and-Drop Board**: Seamlessly move tasks between columns (To Do, In Progress, In Review, Done)
- **Real-time Updates**: Tasks update instantly when moved across columns
- **Guest Accounts**: No login required - automatic anonymous sessions
- **Task Management**: Create, edit, delete, and organize tasks
- **Persistent Storage**: All tasks saved to Supabase with Row Level Security
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile

### Task Details 📝
- **Title and Description**: Full task details with markdown support
- **Priority Levels**: Low, Normal, High with color-coded indicators
- **Due Dates**: Set task deadlines with visual overdue/due-soon indicators
- **Task Metadata**: Automatic timestamps and creation tracking
- **Edit & Delete**: Quick actions to modify or remove tasks

### User Experience 🎨
- **Modern Design**: Clean, polished interface inspired by Asana and Linear
- **Empty States**: Thoughtful empty states for new users
- **Loading States**: Clear feedback during data operations
- **Error Handling**: User-friendly error messages and recovery
- **Board Statistics**: Real-time stats showing total, in-progress, and completed tasks
- **Color System**: Intentional color palette for visual hierarchy

---

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: CSS 3 with variables and responsive design
- **Build Tool**: Vite
- **Drag & Drop**: @dnd-kit/core & @dnd-kit/sortable
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Anonymous Auth
- **Hosting**: Vercel (optional deployment target)

---

## Database Schema

### Tables

#### `tasks`
```sql
- id (UUID, primary key)
- title (TEXT, required)
- description (TEXT)
- status (TEXT: 'todo', 'in_progress', 'in_review', 'done')
- priority (TEXT: 'low', 'normal', 'high')
- user_id (UUID, foreign key to auth.users)
- assignee_id (UUID, optional)
- due_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `labels` (for advanced features)
```sql
- id (UUID, primary key)
- name (TEXT)
- color (TEXT)
- user_id (UUID, foreign key)
- created_at (TIMESTAMP)
```

#### `comments` (for advanced features)
```sql
- id (UUID, primary key)
- task_id (UUID, foreign key to tasks)
- user_id (UUID, foreign key to auth.users)
- content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `activity_log` (for tracking changes)
```sql
- id (UUID, primary key)
- task_id (UUID, foreign key)
- user_id (UUID, foreign key)
- action (TEXT)
- old_value (TEXT)
- new_value (TEXT)
- created_at (TIMESTAMP)
```

#### `team_members` (for team collaboration)
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (TEXT)
- avatar_color (TEXT)
- avatar_initials (TEXT)
- created_at (TIMESTAMP)
```

**Row Level Security (RLS)**: Enabled on all tables. Users can only view and modify their own data.

---

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn
- Supabase account (free tier)
- Git

### Local Development

#### 1. Clone Repository
```bash
git clone [your-repo-url]
cd task-board
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Set Up Supabase

**Create a Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to initialize

**Set Up Database Schema:**
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase_schema.sql`
3. Click "Run" to execute the schema

**Get API Keys:**
1. Go to Settings → API in your Supabase project
2. Copy your `Project URL` and `Anon Key`

#### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit secrets to Git. The `.gitignore` file should already exclude `.env.local`

#### 5. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### 6. Test the App
- Open the app in your browser
- Create a task by clicking "+ New Task"
- Fill in the task details (title required)
- Click "Create"
- Drag tasks between columns
- Click edit/delete icons on task cards

---

## Project Structure

```
task-board/
├── src/
│   ├── App.tsx              # Main app component with board logic
│   ├── App.css              # App-specific styles
│   ├── index.css            # Global styles (design system)
│   ├── main.tsx             # Entry point
│   ├── hooks/
│   │   ├── useAuth.ts       # Guest authentication logic
│   │   └── useTasks.ts      # Task CRUD operations
│   ├── lib/
│   │   ├── constants.ts     # App constants and color palette
│   │   └── supabaseClient.ts # Supabase client initialization
│   └── assets/              # Static assets
├── public/                  # Public files
├── supabase_schema.sql      # Database schema
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md               # This file
```

---

## How It Works

### Authentication
- When the app loads, it checks if a user is logged in
- If not, it automatically creates an anonymous session using Supabase Auth
- The user ID is stored and used to filter tasks via Row Level Security

### Task Management
- Tasks are stored in Supabase with RLS policies
- Users can only see and modify their own tasks
- All operations are real-time with instant UI updates

### Drag & Drop
- Uses `@dnd-kit` for accessible drag-and-drop
- When a task is dropped on a column, its status updates immediately
- The backend updates the database and the UI reflects the change

### State Management
- Component state is managed with React hooks
- Data is fetched from Supabase on mount and after each operation
- Loading and error states provide user feedback

---

## Deployment to Vercel

### Steps

1. **Push to GitHub** (if not already done)
```bash
git add .
git commit -m "Initial commit: Task board app"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Add Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your live URL will be displayed (e.g., `task-board-xyz.vercel.app`)

---

## Advanced Features (If Implemented)

### Team Members & Assignees
- Create team members within your workspace
- Assign members to tasks
- Show avatars on task cards

### Task Comments
- Open task details panel
- Write and view comments chronologically
- Track who commented and when

### Activity Log
- View all changes made to a task
- See status changes, edits, and assignments
- Timeline view of task history

### Labels/Tags
- Create custom labels (e.g., "Bug", "Feature", "Design")
- Assign multiple labels to tasks
- Filter board by label

### Due Date Indicators
- Visual badges for overdue tasks
- Warnings for tasks due soon
- Color-coded urgency levels

### Search & Filtering
- Search tasks by title
- Filter by priority, assignee, or label
- Quick access to specific tasks

### Board Statistics
- Display task counts by status
- Track completion progress
- Show project metrics at a glance

---

## Security & Privacy

### Row Level Security (RLS)
- All tables have RLS policies enabled
- Users can only read/write their own data
- Even admins cannot access user data without explicit authorization

### API Keys
- Only the **anon** (public) key is used in the frontend
- The service role key is **never** exposed
- Sensitive operations require RLS policies

### Best Practices
- No credentials stored in the frontend
- All user data is isolated per session
- Authentication happens server-side via Supabase

---

## Troubleshooting

### Build Errors
```bash
npm run lint        # Check for linting errors
npm run build       # Try a fresh build
```

### Supabase Connection Issues
1. Verify `.env.local` has correct URL and key
2. Check that your Supabase project is active
3. Ensure RLS policies are enabled on tables
4. Check browser console for detailed errors

### Tasks Not Appearing
1. Verify you're logged in (check console for user ID)
2. Ensure tasks exist in Supabase (check the `tasks` table)
3. Try refreshing the page
4. Check browser DevTools → Network tab for API errors

### Drag & Drop Not Working
1. Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
2. Try disabling browser extensions
3. Check console for JavaScript errors

---

## Development Notes

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Component-based architecture
- Reusable hooks for logic

### Performance
- CSS Grid for responsive layout
- Efficient re-renders with React hooks
- Database indexes on frequently queried columns
- Lazy loading of images (if added)

### Accessibility
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Color-independent visual design

---

## Future Improvements

- [ ] Dark mode support
- [ ] Real-time collaboration (multiple users)
- [ ] Advanced filtering and search
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Time tracking
- [ ] Mobile app (React Native)
- [ ] Webhooks for integrations
- [ ] Analytics dashboard

---

## Support & Questions

For issues or questions:
1. Check the [Supabase docs](https://supabase.com/docs)
2. Review [React documentation](https://react.dev)
3. Check [@dnd-kit docs](https://docs.dnd-kit.com)
4. Open an issue on GitHub

---

## License

This project is open source and available under the MIT License.

---

**Built with ❤️ by [Your Name]**

Last updated: March 2026
