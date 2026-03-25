import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [scores, setScores] = useState([])
  const [charities, setCharities] = useState([])
  const [selectedCharity, setSelectedCharity] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    const u = JSON.parse(stored)
    setUser(u)
    fetchScores(u.id)
    fetchCharities()
  }, [])

  const fetchScores = async (user_id) => {
    const res = await fetch(`/api/scores/get?user_id=${user_id}`)
    const data = await res.json()
    setScores(data.scores || [])
  }

  const fetchCharities = async () => {
    const res = await fetch('/api/charities/get')
    const data = await res.json()
    setCharities(data.charities || [])
  }

  const handleCharitySelect = async () => {
    const res = await fetch('/api/user/update-charity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, charity_id: selectedCharity })
    })
    const data = await res.json()
    if (data.error) return setMessage(data.error)
    setMessage('Charity updated!')
    const updated = { ...user, charity_id: selectedCharity }
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!user) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2>Welcome, {user.name}</h2>
          <p style={{ color: 'gray' }}>{user.email}</p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Subscription Status */}
      <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 24 }}>
        <h3>Subscription</h3>
        <p>Status: <strong style={{ color: user.subscription_status === 'active' ? 'green' : 'red' }}>
          {user.subscription_status || 'Inactive'}
        </strong></p>
        <p>Plan: <strong>{user.subscription_plan || 'None'}</strong></p>
        {user.subscription_status !== 'active' && (
          <button onClick={() => router.push('/subscribe')}
            style={{ marginTop: 8, background: 'green', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>
            Subscribe Now
          </button>
        )}
      </div>

      {/* Recent Scores */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>My Scores</h3>
          <button onClick={() => router.push('/scores')}>Add Score</button>
        </div>
        {scores.length === 0 && <p style={{ color: 'gray' }}>No scores yet</p>}
        {scores.map(s => (
          <div key={s.id} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 16px', margin: '6px 0',
            border: '1px solid #eee', borderRadius: 8
          }}>
            <span>Score: <strong>{s.score}</strong></span>
            <span style={{ color: 'gray' }}>{s.date}</span>
          </div>
        ))}
      </div>

      {/* Charity Selection */}
      <div style={{ marginBottom: 24 }}>
        <h3>Select Charity</h3>
        <p style={{ color: 'gray' }}>10% of your subscription goes to your chosen charity</p>
        <select
          onChange={e => setSelectedCharity(e.target.value)}
          value={selectedCharity}
          style={{ marginRight: 8, padding: '6px 12px' }}
        >
          <option value=''>Choose a charity</option>
          {charities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button onClick={handleCharitySelect}>Save</button>
        {message && <p style={{ color: 'green', marginTop: 8 }}>{message}</p>}
        {user.charity_id && (
          <p style={{ marginTop: 8 }}>
            Current: <strong>{charities.find(c => c.id === user.charity_id)?.name || 'Selected'}</strong>
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => router.push('/scores')}>Manage Scores</button>
        <button onClick={() => router.push('/draws')}>View Draws</button>
      </div>

    </div>
  )
}