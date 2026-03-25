import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'


export default function Draws() {
  const [draws, setDraws] = useState([])

  useEffect(() => { fetchDraws() }, [])

  const fetchDraws = async () => {
    const res = await fetch('/api/draws/get')
    const data = await res.json()
    setDraws(data.draws || [])
  }
  const router = useRouter()

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: 24 }}>
      <button onClick={() => router.push('/dashboard')}
        style={{ marginBottom: 20, background: 'none', border: '1px solid #eee', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', color: 'gray' }}>
        ← Back to Dashboard
      </button>
      <h2>Monthly Draws</h2>
      {draws.length === 0 && <p style={{ color: 'gray' }}>No draws yet</p>}
      {draws.map(d => (
        <div key={d.id} style={{
          padding: '16px 20px', margin: '12px 0',
          border: '1px solid #eee', borderRadius: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>Draw — {d.draw_date}</strong>
            <span style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 12,
              background: d.status === 'published' ? '#e6f4ea' : '#fff3e0',
              color: d.status === 'published' ? 'green' : 'orange'
            }}>
              {d.status}
            </span>
          </div>
          <p style={{ color: 'gray', fontSize: 13 }}>
            Winning Numbers: <strong>{d.winning_numbers?.join(', ') || 'TBC'}</strong>
          </p>
        </div>
      ))}
    </div>
  )
}