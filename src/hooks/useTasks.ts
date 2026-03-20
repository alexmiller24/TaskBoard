import { supabase } from '../lib/supabaseClient'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'in_review' | 'done'
  priority?: 'low' | 'normal' | 'high'
  user_id: string
  assignee_id?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export async function createTask(
  title: string,
  userId?: string,
  description?: string,
  priority?: string,
  dueDate?: string
) {
  // If caller didn't provide a userId, attempt to get it from the current session
  let uid = userId
  if (!uid) {
    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr) {
      console.error('Error fetching user for createTask fallback:', userErr)
      throw userErr
    }
    uid = userData?.user?.id
  }

  const { data, error } = await supabase.from('tasks').insert({
    title,
    description,
    status: 'todo',
    priority,
    due_date: dueDate,
    user_id: uid
  }).select()

  if (error) {
    console.error('Error creating task:', error)
    throw error
  }

  return data?.[0]
}

export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }

  return data
}

export const updateTaskStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating task status:', error)
    throw error
  }

  return data?.[0]
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  // Verify ownership before attempting update to avoid RLS errors and provide clearer messages
  const { data: existingTask, error: fetchErr } = await supabase
    .from('tasks')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchErr) {
    console.error('Error fetching task for update:', fetchErr)
    throw fetchErr
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) {
    console.error('Error getting session user before update:', userErr)
    throw userErr
  }

  const uid = userData?.user?.id
  if (!uid || existingTask.user_id !== uid) {
    const err = { message: 'Not authorized to update this task', code: 'FORBIDDEN' }
    console.error('Update authorization failed:', err)
    throw err
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating task:', error)
    throw error
  }

  return data?.[0]
}

export const deleteTask = async (id: string) => {
  // Verify ownership before delete to avoid RLS errors and provide clearer messages
  const { data: existingTask, error: fetchErr } = await supabase
    .from('tasks')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchErr) {
    console.error('Error fetching task for delete:', fetchErr)
    throw fetchErr
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) {
    console.error('Error getting session user before delete:', userErr)
    throw userErr
  }

  const uid = userData?.user?.id
  if (!uid || existingTask.user_id !== uid) {
    const err = { message: 'Not authorized to delete this task', code: 'FORBIDDEN' }
    console.error('Delete authorization failed:', err)
    throw err
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export const getTaskById = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching task:', error)
    throw error
  }

  return data
}
