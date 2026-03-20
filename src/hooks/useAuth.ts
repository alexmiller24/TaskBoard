import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export interface User {
  id: string
  email?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        let { data } = await supabase.auth.getUser()

        if (!data.user) {
          const { data: signInData, error: signInError } = await supabase.auth.signInAnonymously()
          if (signInError) throw signInError
          setUser(signInData.user as unknown as User)
        } else {
          setUser(data.user as unknown as User)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Authentication failed'
        setError(message)
        console.error('Auth error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
    // Subscribe to auth state changes so UI user stays in sync with Supabase session
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user as unknown as User)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => {
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  return { user, loading, error }
}