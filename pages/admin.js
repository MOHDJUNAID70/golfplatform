import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [scores, setScores] = useState([])
  const [charities, setCharities] = useState([])
  const [newCharity, setNewCharity] = useState({ name: '', description: '' })
  const [tab, setTab] = useState('users')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    const u = JSON.parse(stored)
    if (u.role !== 'admin') return router.push('/dashboard')
    fetchAll()
  }, [])

  const fetchAll = async () => {
    const [u, s, c] = await Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/scores').then(r => r.json()),
      fetch('/api/charities/get').then(r => r.json()),
    ])
    setUsers(u.users || [])
    setScores(s.scores || [])
    setCharities(c.charities || [])
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
    const res = await fetch('/api/admin/add-charity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCharity)
    })
    const data = await res.json()
    if (data.error) return setMessage(data.error)
    setMessage('Charity added!')
    setNewCharity({ name: '', description: '' })
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

  const tabStyle = (t) => ({
    padding: '8px 20px', cursor: 'pointer', borderBottom: tab === t ? '2px solid #0070f3' : '2px solid transparent',
    color: tab === t ? '#0070f3' : 'gray', background: 'none', border: 'none', fontSize: 15
  })

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <h2>Admin Panel</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #eee', marginBottom: 24 }}>
        <button style={tabStyle('users')} onClick={() => setTab('users')}>Users ({users.length})</button>
        <button style={tabStyle('scores')} onClick={() => setTab('scores')}>Scores ({scores.length})</button>
        <button style={tabStyle('charities')} onClick={() => setTab('charities')}>Charities ({charities.length})</button>
        <button style={tabStyle('draws')} onClick={() => setTab('draws')}>Draws</button>
      </div>

      {message && <p style={{ color: 'green', marginBottom: 16 }}>{message}</p>}

      {/* Users Tab */}
      {tab === 'users' && (
        <div>
          <h3>All Users</h3>
          {users.map(u => (
            <div key={u.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', margin: '8px 0', border: '1px solid #eee', borderRadius: 8
            }}>
              <div>
                <strong>{u.name}</strong>
                <p style={{ color: 'gray', margin: 0, fontSize: 13 }}>{u.email}</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 12,
                  background: u.subscription_status === 'active' ? '#e6f4ea' : '#fce8e6',
                  color: u.subscription_status === 'active' ? 'green' : 'red'
                }}>
                  {u.subscription_status || 'inactive'}
                </span>
                <span style={{ fontSize: 12, color: 'gray' }}>{u.role}</span>
                <button onClick={() => handleDeleteUser(u.id)}
                  style={{ color: 'red', background: 'none', border: '1px solid red', padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scores Tab */}
      {tab === 'scores' && (
        <div>
          <h3>All Scores</h3>
          {scores.map(s => (
            <div key={s.id} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 16px', margin: '6px 0', border: '1px solid #eee', borderRadius: 8
            }}>
              <span><strong>{s.users?.name}</strong> — {s.users?.email}</span>
              <span>Score: <strong>{s.score}</strong> | {s.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Charities Tab */}
      {tab === 'charities' && (
        <div>
          <h3>Add Charity</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input placeholder="Charity name" value={newCharity.name}
              onChange={e => setNewCharity({ ...newCharity, name: e.target.value })} />
            <input placeholder="Description" value={newCharity.description}
              onChange={e => setNewCharity({ ...newCharity, description: e.target.value })} />
            <button onClick={handleAddCharity}>Add</button>
          </div>

          <h3>All Charities</h3>
          {charities.map(c => (
            <div key={c.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px', margin: '6px 0', border: '1px solid #eee', borderRadius: 8
            }}>
              <div>
                <strong>{c.name}</strong>
                <p style={{ margin: 0, color: 'gray', fontSize: 13 }}>{c.description}</p>
              </div>
              <button onClick={() => handleDeleteCharity(c.id)}
                style={{ color: 'red', background: 'none', border: '1px solid red', padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Draws Tab */}
{tab === 'draws' && (
  <div>
    <h3>Draw Management</h3>
    <button
      onClick={async () => {
        const res = await fetch('/api/draws/create', { method: 'POST' })
        const data = await res.json()
        if (data.draw) {
          setMessage(`Draw created! Numbers: ${data.draw.winning_numbers.join(', ')}`)
          fetchAll()
        }
      }}
      style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', marginBottom: 16 }}>
      Generate New Draw
    </button>

    <DrawsList />
  </div>
)}
    </div>
  )
  function DrawsList() {
  const [draws, setDraws] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => { fetchDraws() }, [])

  const fetchDraws = async () => {
    const res = await fetch('/api/draws/get')
    const data = await res.json()
    setDraws(data.draws || [])
  }

  const runDraw = async (draw_id) => {
    const res = await fetch('/api/draws/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draw_id })
    })
    const data = await res.json()
    setMessage(`Winners found: ${data.winners?.length || 0}`)
    fetchDraws()
  }

  return (
    <div>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {draws.map(d => (
        <div key={d.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', margin: '8px 0', border: '1px solid #eee', borderRadius: 8
        }}>
          <div>
            <strong>{d.draw_date}</strong>
            <p style={{ margin: 0, fontSize: 13, color: 'gray' }}>
              Numbers: {d.winning_numbers?.join(', ')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 12,
              background: d.status === 'published' ? '#e6f4ea' : '#fff3e0',
              color: d.status === 'published' ? 'green' : 'orange'
            }}>{d.status}</span>
            {d.status === 'pending' && (
              <button onClick={() => runDraw(d.id)}
                style={{ background: 'green', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
                Run Draw
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
}