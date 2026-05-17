export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('flixnet_user')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Failed to read current user from storage:', error)
    return null
  }
}

export function saveCurrentUser(user) {
  if (!user) return
  localStorage.setItem('flixnet_user', JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem('flixnet_user')
}

export function isAdmin(user) {
  return user?.role === 'admin'
}
