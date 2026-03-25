import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Scores() {
  const [score, setScore] = useState('')
  const [date, setDate] = useState('')
  const [scores, setScores] = useState([])
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      fetchScores(u.id)
    }
  }, [])

  const fetchScores = async (user_id) => {
    const res = await fetch(`/api/scores/get?user_id=${user_id}`)
    const data = await res.json()
    setScores(data.scores || [])
  }

  const handleSubmit = async () => {
    if (!score || score < 1 || score > 45) {
      return setMessage('Score must be between 1 and 45')
    }
    if (!date) return setMessage('Please select a date')

    const res = await fetch('/api/scores/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, score: parseInt(score), date })
    })
    const data = await res.json()
    if (data.error) return setMessage(data.error)
    setMessage('Score added!')
    setScore('')
    setDate('')
    fetchScores(user.id)
  }
  const router = useRouter()

  return (
    <div style={{ maxWidth: 500, margin: '60px auto', padding: 24 }}>
      <button onClick={() => router.push('/dashboard')}
        style={{ marginBottom: 20, background: 'none', border: '1px solid #eee', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', color: 'gray' }}>
        ← Back to Dashboard
      </button>
      <h2>My Golf Scores</h2>
      <p style={{ color: 'gray' }}>Only last 5 scores are kept</p>

      <div style={{ margin: '20px 0' }}>
        <input
          type="number"
          placeholder="Score (1-45)"
          value={score}
          onChange={e => setScore(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleSubmit}>Add Score</button>
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      <h3>Recent Scores</h3>
      {scores.length === 0 && <p>No scores yet</p>}
      {scores.map((s, i) => (
        <div key={s.id} style={{
          padding: '10px 16px',
          margin: '8px 0',
          border: '1px solid #eee',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Score: <strong>{s.score}</strong></span>
          <span style={{ color: 'gray' }}>{s.date}</span>
        </div>
      ))}
    </div>
  )
}