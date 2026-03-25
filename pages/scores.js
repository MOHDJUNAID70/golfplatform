import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Scores() {
  const router = useRouter()
  const [score, setScore] = useState('')
  const [date, setDate] = useState('')
  const [scores, setScores] = useState([])
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    const u = JSON.parse(stored)
    setUser(u)
    fetchScores(u.id)
  }, [])

  const fetchScores = async (user_id) => {
    const res = await fetch(`/api/scores/get?user_id=${user_id}`)
    const data = await res.json()
    setScores(data.scores || [])
  }

  const handleSubmit = async () => {
    if (!score || score < 1 || score > 45) return setMessage('Score must be between 1 and 45')
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
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#0070f3', cursor: 'pointer' }} onClick={() => router.push('/')}>GolfGives</span>
        <button onClick={() => router.push('/dashboard')}
          style={{ padding: '6px 16px', background: 'none', border: '1px solid #eee', borderRadius: 8, fontSize: 13, color: 'gray' }}>
          ← Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: 560, margin: '40px auto', padding: '0 24px' }}>

        {/* Add Score Card */}
        <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 16, padding: 28, marginBottom: 24 }}>
          <h2 style={{ marginBottom: 6 }}>Add Score</h2>
          <p style={{ color: 'gray', fontSize: 14, marginBottom: 24 }}>Stableford format · Range 1–45 · Only last 5 kept</p>

          <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Score</label>
          <input
            type="number" min="1" max="45"
            placeholder="Enter score (1-45)"
            value={score}
            onChange={e => setScore(e.target.value)}
          />

          <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Date Played</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          {message && (
            <p style={{ color: message.includes('must') ? 'red' : '#16a34a', fontSize: 13, marginBottom: 12 }}>
              {message}
            </p>
          )}

          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600 }}>
            Add Score
          </button>
        </div>

        {/* Scores List */}
        <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3>My Scores</h3>
            <span style={{ fontSize: 13, color: 'gray' }}>{scores.length}/5 slots used</span>
          </div>

          {scores.length === 0
            ? <p style={{ color: 'gray', fontSize: 14 }}>No scores yet</p>
            : scores.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: i < scores.length - 1 ? '1px solid #f5f5f5' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, background: '#f0f7ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0070f3', fontSize: 18 }}>
                    {s.score}
                  </div>
                  <span style={{ fontSize: 14, color: 'gray' }}>{s.date}</span>
                </div>
                {i === 0 && (
                  <span style={{ fontSize: 11, background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                    Latest
                  </span>
                )}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}