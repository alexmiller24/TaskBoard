import { useEffect, useState, useCallback } from 'react'
import { getTasks, createTask, updateTaskStatus } from './hooks/useTasks'
import { useAuth } from './hooks/useAuth'
import { DndContext, closestCenter } from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import { STATUS_LABELS, PRIORITY_LABELS, TASK_STATUSES } from './lib/constants'
import './App.css'
import type { Task } from './hooks/useTasks'

interface DraggableTaskProps {
  task: Task
}

function DraggableTask({ task }: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date()
  const isDueSoon = task.due_date && 
    new Date(task.due_date) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) &&
    !isOverdue

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...listeners} 
      {...attributes}
      className="task-card"
    >
      <div className="task-header">
        <div className="task-title">{task.title}</div>
        {task.priority && (
          <span className={`task-priority ${task.priority}`}>
            {PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS]}
          </span>
        )}
      </div>
      
      {task.description && (
        <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
          {task.description}
        </div>
      )}
      
      <div className="task-meta">
        {task.due_date && (
          <span className={`task-due-date ${isOverdue ? 'overdue' : isDueSoon ? 'due-soon' : ''}`}>
            📅 {formatDate(task.due_date)}
          </span>
        )}
      </div>

      <div className="task-footer">
        <span>{task.created_at ? new Date(task.created_at).toLocaleDateString() : ''}</span>
        <div className="task-actions">
          {/* Edit/Delete removed per user request */}

        </div>
      </div>
    </div>
  )
}

interface DroppableColumnProps {
  id: string
  children: React.ReactNode
}

function DroppableColumn({ id, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="column">
      {children}
    </div>
  )
}

interface TaskModalProps {
  isOpen: boolean
  task?: Task
  onClose: () => void
  onSave: (title: string, description?: string, priority?: string, dueDate?: string) => void
  isLoading?: boolean
}

function TaskModal({ isOpen, task, onClose, onSave, isLoading }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>('')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority || '')
      setDueDate(task.due_date || '')
    } else {
      setTitle('')
      setDescription('')
      setPriority('')
      setDueDate('')
    }
  }, [task, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title, description, priority || undefined, dueDate || undefined)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button type="button" className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading: authLoading, error: authError } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadTasks = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data || [])
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(message)
      console.error('Load tasks error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadTasks()
    }
  }, [user, loadTasks])

  

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as string

    if (!TASK_STATUSES.includes(newStatus as any)) return

    try {
      await updateTaskStatus(taskId, newStatus)
      await loadTasks()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task'
      setError(message)
      console.error('Update error:', err)
    }
  }

  const handleCreateTask = async (title: string, description?: string, priority?: string, dueDate?: string) => {
    try {
      setIsSaving(true)
      // Do not trust the `user` state here (it can be out of sync after a manual sign-in).
      // Let `createTask` fetch the active session user id to satisfy RLS.
      await createTask(title, undefined, description, priority, dueDate)
      setIsModalOpen(false)
      await loadTasks()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task'
      setError(message)
      console.error('Create error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  

  if (authLoading) {
    return (
      <div className="app">
        <div className="loading" style={{ justifyContent: 'center', minHeight: '100vh', alignItems: 'center' }}>
          <div className="spinner"></div>
          Loading...
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="app">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>Authentication error: {authError}</span>
        </div>
      </div>
    )
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span style={{ fontSize: '28px' }}>📋</span>
            <h1>Task Board</h1>
          </div>

          <div className="header-stats">
            <div className="stat-item">
              <div className="stat-item-value">{stats.total}</div>
              <div className="stat-item-label">Total Tasks</div>
            </div>
            <div className="stat-item">
              <div className="stat-item-value">{stats.inProgress}</div>
              <div className="stat-item-label">In Progress</div>
            </div>
            <div className="stat-item">
              <div className="stat-item-value">{stats.completed}</div>
              <div className="stat-item-label">Completed</div>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + New Task
            </button>
          </div>
        </div>
      </header>

      

      <main className="app-main">
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading" style={{ justifyContent: 'center', minHeight: '400px', alignItems: 'center' }}>
            <div className="spinner"></div>
            Loading tasks...
          </div>
        ) : (
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="board">
              {TASK_STATUSES.map((status) => {
                const columnTasks = tasks.filter((task) => task.status === status)
                return (
                  <DroppableColumn key={status} id={status}>
                    <div className="column-header">
                      <span className="column-title">
                        {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                      </span>
                      <span className="column-badge">{columnTasks.length}</span>
                    </div>

                    <div className="column-content">
                      {columnTasks.length === 0 ? (
                        <div className="empty-state">
                          <div className="empty-state-icon">📭</div>
                          <div className="empty-state-text">No tasks</div>
                        </div>
                      ) : (
                        columnTasks.map((task) => (
                          <DraggableTask
                            key={task.id}
                            task={task}
                          />
                        ))
                      )}
                    </div>
                  </DroppableColumn>
                )
              })}
            </div>
          </DndContext>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        onSave={handleCreateTask}
        isLoading={isSaving}
      />
    </div>
  )
}