import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [charities, setCharities] = useState([])
  const [draws, setDraws] = useState([])
  const [newCharity, setNewCharity] = useState({ name: '', description: '' })
  const [tab, setTab] = useState('users')
  const [message, setMessage] = useState('')
  const [winners, setWinners] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    const u = JSON.parse(stored)
    if (u.role !== 'admin') return router.push('/dashboard')
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [u, s, c, d, w] = await Promise.allSettled([
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/scores').then(r => r.json()),
        fetch('/api/charities/get').then(r => r.json()),
        fetch('/api/draws/get').then(r => r.json()),
        fetch('/api/admin/winner').then(r => r.json()),
      ])
      setUsers(u.status === 'fulfilled' ? (u.value.users || []) : [])
      setScores(s.status === 'fulfilled' ? (s.value.scores || []) : [])
      setCharities(c.status === 'fulfilled' ? (c.value.charities || []) : [])
      setDraws(d.status === 'fulfilled' ? (d.value.draws || []) : [])
      setWinners(w.status === 'fulfilled' ? (w.value.winners || []) : [])

      if ([u, s, c, d, w].some(result => result.status === 'rejected')) {
        setMessage('Some admin data could not be loaded')
      }
    } catch (error) {
      console.error('Failed to load admin data:', error)
      setMessage('Failed to load admin data')
    }
  }

  const handleDeleteUser = async (user_id) => {
    if (!confirm('Delete this user?')) return
    await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    })
    fetchAll()
  }

  const handleAddCharity = async () => {
    if (!newCharity.name) return setMessage('Name required')
    await fetch('/api/admin/add-charity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCharity)
    })
    setMessage('Charity added!')
    setNewCharity({ name: '', description: '' })
    setTimeout(() => setMessage(''), 2000)
    fetchAll()
  }

  const handleDeleteCharity = async (id) => {
    if (!confirm('Delete this charity?')) return
    await fetch('/api/admin/delete-charity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchAll()
  }

  const handleCreateDraw = async () => {
    const res = await fetch('/api/draws/create', { method: 'POST' })
    const data = await res.json()
    if (data.draw) {
      setMessage(`Draw created! Numbers: ${data.draw.winning_numbers.join(', ')}`)
      setTimeout(() => setMessage(''), 3000)
      fetchAll()
    }
  }

  const handleRunDraw = async (draw_id) => {
    const res = await fetch('/api/draws/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draw_id })
    })
    const data = await res.json()
    setMessage(`Draw completed! Winners: ${data.winners?.length || 0}`)
    setTimeout(() => setMessage(''), 3000)
    fetchAll()
  }

  const tabs = [
    { key: 'users', label: `Users (${users.length})` },
    { key: 'scores', label: `Scores (${scores.length})` },
    { key: 'charities', label: `Charities (${charities.length})` },
    { key: 'draws', label: `Draws (${draws.length})` },
    { key: 'winners', label: `Winners (${winners.length})` },
  ]

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

      <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 24px' }}>

        <h2 style={{ marginBottom: 24 }}>Admin Panel</h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Active Subscribers', value: users.filter(u => u.subscription_status === 'active').length },
            { label: 'Total Scores', value: scores.length },
            { label: 'Total Draws', value: draws.length },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px' }}>
              <p style={{ fontSize: 12, color: 'gray', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#0070f3' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'white', border: '1px solid #eee', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '8px 18px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 500,
                background: tab === t.key ? '#0070f3' : 'transparent',
                color: tab === t.key ? 'white' : 'gray',
                transition: 'all 0.2s'
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {message && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#16a34a', fontSize: 14 }}>
            {message}
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
            {users.map((u, i) => (
              <div key={u.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < users.length - 1 ? '1px solid #f5f5f5' : 'none'
              }}>
                <div>
                  <p style={{ fontWeight: 500, marginBottom: 2 }}>{u.name}</p>
                  <p style={{ fontSize: 13, color: 'gray' }}>{u.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    background: u.subscription_status === 'active' ? '#f0fdf4' : '#fef2f2',
                    color: u.subscription_status === 'active' ? '#16a34a' : '#dc2626'
                  }}>
                    {u.subscription_status || 'inactive'}
                  </span>
                  <span style={{ fontSize: 12, color: 'gray', background: '#f5f5f5', padding: '3px 10px', borderRadius: 20 }}>{u.role}</span>
                  <button onClick={() => handleDeleteUser(u.id)}
                    style={{ color: '#dc2626', background: 'none', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: 6, fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scores Tab */}
        {tab === 'scores' && (
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
            {scores.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px',
                borderBottom: i < scores.length - 1 ? '1px solid #f5f5f5' : 'none'
              }}>
                <div>
                  <p style={{ fontWeight: 500, marginBottom: 2 }}>{s.users?.name}</p>
                  <p style={{ fontSize: 13, color: 'gray' }}>{s.users?.email}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, background: '#f0f7ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0070f3' }}>
                    {s.score}
                  </div>
                  <span style={{ fontSize: 13, color: 'gray' }}>{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charities Tab */}
        {tab === 'charities' && (
          <div>
            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16, fontSize: 15 }}>Add New Charity</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Name</label>
                  <input placeholder="Charity name" value={newCharity.name}
                    onChange={e => setNewCharity({ ...newCharity, name: e.target.value })}
                    style={{ marginBottom: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Description</label>
                  <input placeholder="Short description" value={newCharity.description}
                    onChange={e => setNewCharity({ ...newCharity, description: e.target.value })}
                    style={{ marginBottom: 0 }} />
                </div>
                <button onClick={handleAddCharity}
                  style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, height: 42 }}>
                  Add
                </button>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
              {charities.map((c, i) => (
                <div key={c.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: i < charities.length - 1 ? '1px solid #f5f5f5' : 'none'
                }}>
                  <div>
                    <p style={{ fontWeight: 500, marginBottom: 2 }}>{c.name}</p>
                    <p style={{ fontSize: 13, color: 'gray' }}>{c.description}</p>
                  </div>
                  <button onClick={() => handleDeleteCharity(c.id)}
                    style={{ color: '#dc2626', background: 'none', border: '1px solid #fecaca', padding: '4px 12px', borderRadius: 6, fontSize: 12 }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draws Tab */}
        {tab === 'draws' && (
          <div>
            <button onClick={handleCreateDraw}
              style={{ padding: '10px 24px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, marginBottom: 16 }}>
              + Generate New Draw
            </button>

            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
              {draws.length === 0 && (
                <p style={{ padding: 20, color: 'gray', fontSize: 14 }}>No draws yet</p>
              )}
              {draws.map((d, i) => (
                <div key={d.id} style={{
                  padding: '16px 20px',
                  borderBottom: i < draws.length - 1 ? '1px solid #f5f5f5' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <p style={{ fontWeight: 500 }}>Draw — {d.draw_date}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                        background: d.status === 'published' ? '#f0fdf4' : '#fffbeb',
                        color: d.status === 'published' ? '#16a34a' : '#d97706'
                      }}>
                        {d.status}
                      </span>
                      {d.status === 'pending' && (
                        <button onClick={() => handleRunDraw(d.id)}
                          style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                          Run Draw
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {d.winning_numbers?.map((n, idx) => (
                      <div key={idx} style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: '#0070f3', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14
                      }}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winners Tab */}
{tab === 'winners' && (
  <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
    {winners.length === 0 && (
      <p style={{ padding: 20, color: 'gray', fontSize: 14 }}>No winners yet</p>
    )}
    {winners.map((w, i) => (
      <div key={w.id} style={{
        padding: '16px 20px',
        borderBottom: i < winners.length - 1 ? '1px solid #f5f5f5' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontWeight: 500, marginBottom: 2 }}>{w.users?.name}</p>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 4 }}>{w.users?.email}</p>
            <p style={{ fontSize: 13, color: 'gray' }}>
              {w.match_type} · Draw: {w.draws?.draw_date} · Prize: <strong>£{w.prize_amount}</strong>
            </p>
            {w.proof_url && (
              <a href={w.proof_url} target="_blank"
                style={{ fontSize: 12, color: '#0070f3', marginTop: 4, display: 'inline-block' }}>
                View Proof →
              </a>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
              background: w.payment_status === 'paid' ? '#f0fdf4' : w.payment_status === 'rejected' ? '#fef2f2' : '#fffbeb',
              color: w.payment_status === 'paid' ? '#16a34a' : w.payment_status === 'rejected' ? '#dc2626' : '#d97706'
            }}>
              {w.payment_status}
            </span>
            {w.payment_status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={async () => {
                  await fetch('/api/admin/verify-winner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ winner_id: w.id, action: 'approve' })
                  })
                  setMessage('Winner approved!')
                  setTimeout(() => setMessage(''), 2000)
                  fetchAll()
                }} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                  Approve
                </button>
                <button onClick={async () => {
                  await fetch('/api/admin/verify-winner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ winner_id: w.id, action: 'reject' })
                  })
                  setMessage('Winner rejected.')
                  setTimeout(() => setMessage(''), 2000)
                  fetchAll()
                }} style={{ background: 'none', color: '#dc2626', border: '1px solid #fecaca', padding: '5px 14px', borderRadius: 6, fontSize: 12 }}>
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  )
}