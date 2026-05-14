import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'

export default function ConnectionCheck() {
  const [status, setStatus] = useState('Checking connection...')
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, name, email, date_of_birth')
        .limit(20)

      if (error) {
        setError(error.message)
        setStatus('Connection failed')
      } else {
        setUsers(data ?? [])
        setStatus(`Connection OK — received ${data.length} record(s) from users table`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div>
      <h2>Database Connection Check</h2>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>User ID</th>
                <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>Name</th>
                <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '0.5rem', textAlign: 'left' }}>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.user_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.email}</td>
                  <td style={{ border: '1px solid #ddd', padding: '0.5rem' }}>{user.date_of_birth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>No users found yet.</p>
      )}
    </div>
  )
}
