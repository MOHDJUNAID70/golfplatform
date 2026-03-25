import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyWins() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [winners, setWinners] = useState([])
  const [proofUrl, setProofUrl] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    const u = JSON.parse(stored)
    setUser(u)
    fetchWins(u.id)
  }, [])

  const fetchWins = async (user_id) => {
    const res = await fetch(`/api/winners/my-wins?user_id=${user_id}`)
    const data = await res.json()
    setWinners(data.winners || [])
  }

  const handleProofSubmit = async (winner_id) => {
    if (!proofUrl[winner_id]) return setMessage('Please enter a proof URL')
    const res = await fetch('/api/winners/upload-proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner_id, proof_url: proofUrl[winner_id] })
    })
    const data = await res.json()
    if (data.error) return setMessage(data.error)
    setMessage('Proof submitted! Admin will review shortly.')
    fetchWins(user.id)
    setTimeout(() => setMessage(''), 3000)
  }

  const statusColor = (status) => {
    if (status === 'paid') return { bg: '#f0fdf4', color: '#16a34a' }
    if (status === 'rejected') return { bg: '#fef2f2', color: '#dc2626' }
    return { bg: '#fffbeb', color: '#d97706' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>

      <nav style={{ background: 'white', borderBottom: '1px solid #eee', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#0070f3', cursor: 'pointer' }} onClick={() => router.push('/')}>GolfGives</span>
        <button onClick={() => router.push('/dashboard')}
          style={{ padding: '6px 16px', background: 'none', border: '1px solid #eee', borderRadius: 8, fontSize: 13, color: 'gray' }}>
          ← Dashboard
        </button>
      </nav>

      <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 24px' }}>
        <h2 style={{ marginBottom: 6 }}>My Winnings</h2>
        <p style={{ color: 'gray', fontSize: 14, marginBottom: 28 }}>Submit proof to claim your prize</p>

        {message && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 16px', marginBottom: 16, color: '#16a34a', fontSize: 14 }}>
            {message}
          </div>
        )}

        {winners.length === 0 && (
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <p style={{ color: 'gray' }}>No wins yet. Keep entering draws!</p>
          </div>
        )}

        {winners.map(w => {
          const sc = statusColor(w.payment_status)
          return (
            <div key={w.id} style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 24, marginBottom: 16 }}>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{w.match_type} Winner</p>
                  <p style={{ fontSize: 13, color: 'gray' }}>Draw: {w.draws?.draw_date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 24, fontWeight: 800, color: '#0070f3', marginBottom: 4 }}>£{w.prize_amount}</p>
                  <span style={{ fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: sc.bg, color: sc.color }}>
                    {w.payment_status}
                  </span>
                </div>
              </div>

              {w.payment_status === 'pending' && (
                <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: 16 }}>
                  <p style={{ fontSize: 13, color: 'gray', marginBottom: 10 }}>
                    Submit a screenshot URL from your golf platform as proof
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      placeholder="Paste screenshot URL here"
                      value={proofUrl[w.id] || ''}
                      onChange={e => setProofUrl({ ...proofUrl, [w.id]: e.target.value })}
                      style={{ flex: 1, marginBottom: 0 }}
                    />
                    <button onClick={() => handleProofSubmit(w.id)}
                      style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontWeight: 500, whiteSpace: 'nowrap' }}>
                      Submit Proof
                    </button>
                  </div>
                </div>
              )}

              {w.proof_url && (
                <div style={{ borderTop: '1px solid #f5f5f5', paddingTop: 12, marginTop: 4 }}>
                  <p style={{ fontSize: 12, color: 'gray' }}>Proof submitted: <a href={w.proof_url} target="_blank" style={{ color: '#0070f3' }}>View</a></p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}