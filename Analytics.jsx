import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'
import { getCurrentUser, isAdmin } from './auth'

export default function Analytics() {
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentUser = getCurrentUser()

  useEffect(() => {
    async function loadAnalytics() {
      if (!isAdmin(currentUser)) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        setError(error.message)
      } else {
        setAnalytics(data ?? [])
      }
      setLoading(false)
    }

    loadAnalytics()
  }, [currentUser])

  if (!currentUser) {
    return (
      <div>
        <h2>Analytics</h2>
        <p>Please log in as an admin user to access analytics.</p>
      </div>
    )
  }

  if (!isAdmin(currentUser)) {
    return (
      <div>
        <h2>Analytics</h2>
        <p>You are not authorized to view this page. Admin only.</p>
      </div>
    )
  }

  const eventCounts = analytics.reduce((acc, item) => {
    acc[item.event_type] = (acc[item.event_type] || 0) + 1
    return acc
  }, {})

  const movieCounts = analytics.reduce((acc, item) => {
    const title = item.movie_title || 'Unknown movie'
    if (!item.movie_title) return acc
    acc[title] = (acc[title] || 0) + 1
    return acc
  }, {})

  const topMovies = Object.entries(movieCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div>
      <h2>Admin Analytics Dashboard</h2>

      <section style={{ marginBottom: '1.5rem' }}>
        <p>
          Logged in as <strong>{currentUser.name}</strong> (<em>{currentUser.role}</em>)
        </p>
        <p>Total analytics events: {analytics.length}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Object.entries(eventCounts).map(([eventType, count]) => (
            <div
              key={eventType}
              style={{ padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', minWidth: '180px' }}
            >
              <strong>{eventType}</strong>
              <div>{count} event(s)</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Top clicked movies</h3>
        {topMovies.length === 0 ? (
          <p>No movie click data yet.</p>
        ) : (
          <ol>
            {topMovies.map(([title, count]) => (
              <li key={title}>
                {title} — {count} click(s)
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h3>Recent analytics events</h3>
        {loading ? (
          <p>Loading analytics...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error loading analytics: {error}</p>
        ) : analytics.length === 0 ? (
          <p>No analytics records have been logged yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '920px' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>Time</th>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>User</th>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>Event</th>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>Page</th>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>Movie</th>
                  <th style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem', background: '#f7f7f7' }}>Metadata</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((event, index) => (
                  <tr key={event.id ?? index}>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>
                      {event.user_name || event.user_id || 'Guest'}
                    </td>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>{event.event_type}</td>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>{event.page}</td>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>{event.movie_title || '-'}</td>
                    <td style={{ border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '0.9rem' }}>
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
