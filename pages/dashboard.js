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
    setSelectedCharity(u.charity_id || '')
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
    setTimeout(() => setMessage(''), 2000)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'gray' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      {/* Navbar */}
      <nav style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#0070f3', cursor: 'pointer' }} onClick={() => router.push('/')}>GolfGives</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: 'gray' }}>Hi, {user.name}</span>
          {user.role === 'admin' && (
            <button onClick={() => router.push('/admin')}
              style={{ padding: '6px 14px', background: '#111', color: 'white', border: 'none', borderRadius: 8, fontSize: 13 }}>
              Admin
            </button>
          )}
          <button onClick={handleLogout}
            style={{ padding: '6px 14px', background: 'none', border: '1px solid #eee', borderRadius: 8, fontSize: 13, color: 'gray' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 24px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Subscription', value: user.subscription_status === 'active' ? 'Active' : 'Inactive', color: user.subscription_status === 'active' ? '#16a34a' : '#dc2626' },
            { label: 'Plan', value: user.subscription_plan ? user.subscription_plan.charAt(0).toUpperCase() + user.subscription_plan.slice(1) : 'None', color: '#0070f3' },
            { label: 'Scores Entered', value: scores.length + ' / 5', color: '#7c3aed' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ fontSize: 12, color: 'gray', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subscribe Banner */}
        {user.subscription_status !== 'active' && (
          <div style={{ background: 'linear-gradient(135deg, #0070f3, #0050b3)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>You're not subscribed yet</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Subscribe to enter monthly draws and support your charity</p>
            </div>
            <button onClick={() => router.push('/subscribe')}
              style={{ background: 'white', color: '#0070f3', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, whiteSpace: 'nowrap' }}>
              Subscribe Now
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Scores */}
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16 }}>My Scores</h3>
              <button onClick={() => router.push('/scores')}
                style={{ fontSize: 12, padding: '5px 12px', background: '#f0f7ff', color: '#0070f3', border: 'none', borderRadius: 6, fontWeight: 500 }}>
                + Add Score
              </button>
            </div>
            {scores.length === 0
              ? <p style={{ color: 'gray', fontSize: 14 }}>No scores yet. Add your first score!</p>
              : scores.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < scores.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#0070f3' }}>{s.score}</span>
                  <span style={{ fontSize: 12, color: 'gray' }}>{s.date}</span>
                </div>
              ))
            }
          </div>

          {/* Charity */}
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>My Charity</h3>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 12 }}>10% of your subscription is donated automatically</p>
            <select
              value={selectedCharity}
              onChange={e => setSelectedCharity(e.target.value)}
              style={{ marginBottom: 12 }}
            >
              <option value=''>Choose a charity</option>
              {charities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button onClick={handleCharitySelect}
              style={{ width: '100%', padding: '10px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500 }}>
              Save Charity
            </button>
            {message && <p style={{ color: '#16a34a', fontSize: 13, marginTop: 8, textAlign: 'center' }}>{message}</p>}
          </div>

        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button onClick={() => router.push('/draws')}
            style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #eee', borderRadius: 10, fontWeight: 500, fontSize: 14 }}>
            View Monthly Draws →
          </button>
          <button onClick={() => router.push('/scores')}
            style={{ flex: 1, padding: '12px', background: 'white', border: '1px solid #eee', borderRadius: 10, fontWeight: 500, fontSize: 14 }}>
            Manage Scores →
          </button>
        </div>

      </div>
    </div>
  )
}