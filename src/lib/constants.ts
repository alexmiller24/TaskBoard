export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done'] as const
export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done'
}

export const PRIORITIES = ['low', 'normal', 'high'] as const
export const PRIORITY_LABELS = {
  low: 'Low',
  normal: 'Normal',
  high: 'High'
}

export const PRIORITY_COLORS = {
  low: '#10b981',
  normal: '#f59e0b',
  high: '#ef4444'
}

export const STATUS_COLORS = {
  todo: '#3b82f6',
  in_progress: '#8b5cf6',
  in_review: '#ec4899',
  done: '#10b981'
}

export const LABEL_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#14b8a6'  // teal
]
