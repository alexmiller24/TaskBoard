import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

function loadDotEnv(path) {
  try {
    const content = fs.readFileSync(path, 'utf8')
    const lines = content.split(/\r?\n/)
    const env = {}
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (m) {
        let val = m[2]
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        env[m[1]] = val
      }
    }
    return env
  } catch (err) {
    console.error('Failed to read env file:', err.message)
    process.exit(1)
  }
}

const env = loadDotEnv('.env.local')
const SUPABASE_URL = env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function run() {
  console.log('Signing in anonymously...')
  const sign = await supabase.auth.signInAnonymously()
  if (sign.error) {
    console.error('Sign-in error:', sign.error.message || sign.error)
    process.exit(1)
  }
  const user = sign.data?.user
  console.log('User id:', user?.id)

  console.log('Fetching tasks...')
  const { data: tasks, error: fetchErr } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  console.log('Fetch tasks error:', JSON.stringify(fetchErr, null, 2))
  console.log('Tasks:', JSON.stringify(tasks, null, 2))

  if (!tasks || tasks.length === 0) {
    console.log('No tasks to update/delete. Create one first.')
    return
  }

  const task = tasks[0]
  console.log('Using task id:', task.id)

  console.log('Attempting update (change title)...')
  const { data: updateData, error: updateErr } = await supabase.from('tasks').update({ title: task.title + ' (updated)' }).eq('id', task.id).select()
  console.log('Update response data:', JSON.stringify(updateData, null, 2))
  console.log('Update response error:', JSON.stringify(updateErr, null, 2))

  console.log('Attempting delete...')
  const { data: deleteData, error: deleteErr } = await supabase.from('tasks').delete().eq('id', task.id).select()
  console.log('Delete response data:', JSON.stringify(deleteData, null, 2))
  console.log('Delete response error:', JSON.stringify(deleteErr, null, 2))

  if (updateErr || deleteErr) process.exit(2)
}

run().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
