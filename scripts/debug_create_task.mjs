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
  console.log('Sign-in result:', JSON.stringify(sign, null, 2))

  if (sign.error) {
    console.error('Sign-in error:', sign.error.message || sign.error)
    process.exit(1)
  }

  const user = sign.data?.user
  console.log('User id:', user?.id)

  console.log('Attempting to insert a test task...')
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: 'Debug Task from CLI',
      description: 'Inserted by debug script',
      status: 'todo',
      user_id: user?.id
    })
    .select()

  console.log('Insert response data:', JSON.stringify(data, null, 2))
  console.log('Insert response error:', JSON.stringify(error, null, 2))

  if (error) process.exit(2)
}

run().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
