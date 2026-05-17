import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseclient'
import { saveCurrentUser } from './auth'
import { logAnalytics } from './analytics'

export default function Login({ onLogin }) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const { data, error } = await supabase
      .from('users')
      .select('user_id, name, role, email')
      .eq('name', name)
      .eq('password', password)
      .single()

    setLoading(false)

    if (error || !data) {
      await logAnalytics('login_failure', {
        page: 'login',
        metadata: { attempted_name: name },
      })
      setError('Login failed. Please check your name and password.')
      return
    }

    saveCurrentUser(data)
    onLogin?.(data)
    await logAnalytics('login_success', { page: 'login' })

    setSuccess(`Welcome back, ${data.name}! Redirecting to Browse Movies...`)
    setTimeout(() => {
      navigate('/browse')
    }, 1000)
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            style={{ width: '100%', maxWidth: '320px' }}
          />
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ width: '100%', maxWidth: '320px' }}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  )
}
