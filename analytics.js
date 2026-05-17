import { supabase } from './supabaseclient'
import { getCurrentUser } from './auth'

export async function logAnalytics(eventType, details = {}) {
  const currentUser = getCurrentUser()
  const payload = {
    user_id: currentUser?.user_id ?? null,
    user_name: currentUser?.name ?? null,
    role: currentUser?.role ?? null,
    event_type: eventType,
    page: details.page ?? null,
    movie_id: details.movie_id ?? null,
    movie_title: details.movie_title ?? null,
    metadata: {
      ...details.metadata,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      url: typeof window !== 'undefined' ? window.location.href : null,
    },
  }

  const { error } = await supabase.from('analytics').insert([payload])
  if (error) {
    console.warn('Analytics logging failed:', error.message)
  }
  return { error }
}
