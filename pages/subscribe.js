import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Subscribe() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    setUser(JSON.parse(stored))
  }, [])

  const handleSubscribe = async () => {
    if (!plan) return setMessage('Please select a plan')
    setLoading(true)
    const res = await fetch('/api/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, plan })
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) return setMessage(data.error)
    const updated = { ...user, subscription_status: 'active', subscription_plan: plan }
    localStorage.setItem('user', JSON.stringify(updated))
    setMessage('Subscribed successfully!')
    setTimeout(() => router.push('/dashboard'), 1500)
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

      <div style={{ maxWidth: 620, margin: '50px auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, marginBottom: 10 }}>Choose Your Plan</h2>
          <p style={{ color: 'gray', fontSize: 15 }}>Subscribe to enter monthly draws and support your charity</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

          {/* Monthly */}
          <div onClick={() => setPlan('monthly')} style={{
            background: 'white', borderRadius: 16, padding: 28, cursor: 'pointer',
            border: plan === 'monthly' ? '2px solid #0070f3' : '1px solid #eee',
            transition: 'border 0.2s'
          }}>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 8 }}>Monthly</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#111', marginBottom: 4 }}>£9.99</p>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 20 }}>per month</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Enter monthly draws', 'Support your charity', 'Track your scores', 'Cancel anytime'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                  <span style={{ color: 'gray' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly */}
          <div onClick={() => setPlan('yearly')} style={{
            background: plan === 'yearly' ? '#f0f7ff' : 'white',
            borderRadius: 16, padding: 28, cursor: 'pointer',
            border: plan === 'yearly' ? '2px solid #0070f3' : '1px solid #eee',
            transition: 'border 0.2s', position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: -12, right: 20, background: '#0070f3', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
              SAVE 20%
            </div>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 8 }}>Yearly</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: '#111', marginBottom: 4 }}>£95.99</p>
            <p style={{ fontSize: 13, color: 'gray', marginBottom: 20 }}>per year</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Enter monthly draws', 'Support your charity', 'Track your scores', '2 months free'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>✓</span>
                  <span style={{ color: f === '2 months free' ? '#0070f3' : 'gray', fontWeight: f === '2 months free' ? 600 : 400 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {message && (
          <p style={{ textAlign: 'center', color: message.includes('success') ? '#16a34a' : 'red', marginBottom: 16, fontSize: 14 }}>
            {message}
          </p>
        )}

        <button onClick={handleSubscribe}
          style={{ width: '100%', padding: '14px', background: plan ? '#0070f3' : '#ccc', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600 }}>
          {loading ? 'Processing...' : plan ? `Subscribe ${plan === 'monthly' ? '· £9.99/mo' : '· £95.99/yr'}` : 'Select a plan to continue'}
        </button>

        <p style={{ textAlign: 'center', color: 'gray', fontSize: 12, marginTop: 12 }}>
          Demo mode — no real payment required
        </p>
      </div>
    </div>
  )
}