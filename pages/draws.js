import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Draws() {
  const router = useRouter()
  const [draws, setDraws] = useState([])

  useEffect(() => { fetchDraws() }, [])

  const fetchDraws = async () => {
    const res = await fetch('/api/draws/get')
    const data = await res.json()
    setDraws(data.draws || [])
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
        <h2 style={{ marginBottom: 6 }}>Monthly Draws</h2>
        <p style={{ color: 'gray', fontSize: 14, marginBottom: 28 }}>Match 3, 4, or 5 numbers to win prizes</p>

        {draws.length === 0 && (
          <div style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <p style={{ color: 'gray' }}>No draws yet. Check back soon!</p>
          </div>
        )}

        {draws.map(d => (
          <div key={d.id} style={{ background: 'white', border: '1px solid #eee', borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 16 }}>Draw — {d.draw_date}</p>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                background: d.status === 'published' ? '#f0fdf4' : '#fffbeb',
                color: d.status === 'published' ? '#16a34a' : '#d97706'
              }}>
                {d.status === 'published' ? 'Published' : 'Pending'}
              </span>
            </div>

            <p style={{ fontSize: 13, color: 'gray', marginBottom: 12 }}>Winning Numbers</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {d.winning_numbers?.map((n, i) => (
                <div key={i} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#0070f3', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16
                }}>
                  {n}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid #f5f5f5' }}>
              {[
                { label: '5 Match', prize: '£500' },
                { label: '4 Match', prize: '£100' },
                { label: '3 Match', prize: '£25' },
              ].map(tier => (
                <div key={tier.label} style={{ flex: 1, textAlign: 'center', background: '#f9fafb', borderRadius: 8, padding: '10px 0' }}>
                  <p style={{ fontSize: 12, color: 'gray', marginBottom: 4 }}>{tier.label}</p>
                  <p style={{ fontWeight: 700, color: '#0070f3' }}>{tier.prize}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}