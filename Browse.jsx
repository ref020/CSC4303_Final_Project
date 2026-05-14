import { useEffect, useState } from 'react'
import { supabase } from './supabaseclient'

const isUrlString = (value) => {
  if (typeof value !== 'string') return false
  return /^(https?:\/\/|www\.)[\w\-]+(\.[\w\-]+)+[\w\-.,@?^=%&:/~+#]*[\w@?^=%&/~+#]$/.test(value)
}

export default function Browse() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMovies() {
      const { data, error } = await supabase
        .from('movies')
        .select('*')

      if (error) {
        setError(error.message)
      } else {
        setMovies(data ?? [])
      }
      setLoading(false)
    }

    loadMovies()
  }, [])

  if (loading) {
    return <p>Loading movie table...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error loading movies: {error}</p>
  }

  const columns = movies.length > 0 ? Object.keys(movies[0]) : []

  return (
    <div>
      <h2>Browse Movies</h2>
      {movies.length === 0 ? (
        <p>No movies found in the database.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '0.75rem',
                      textAlign: 'left',
                      background: 'rgba(0,0,0,0.05)',
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={movie.id ?? movie.movie_id ?? index}>
                  {columns.map((column) => {
                    const value = movie[column]
                    const display =
                      value === null || value === undefined
                        ? '-'
                        : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value)

                    return (
                      <td
                        key={column}
                        style={{
                          border: '1px solid rgba(0,0,0,0.12)',
                          padding: '0.75rem',
                          verticalAlign: 'top',
                        }}
                      >
                        {isUrlString(value) ? (
                          <a
                            href={value.startsWith('http') ? value : `https://${value}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {String(value)}
                          </a>
                        ) : (
                          display
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
