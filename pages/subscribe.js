import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Subscribe() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [plan, setPlan] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) return router.push('/login')
    setUser(JSON.parse(stored))
  }, [])

  const handleSubscribe = async () => {
    if (!plan) return setMessage('Please select a plan')

    const res = await fetch('/api/subscription/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, plan })
    })
    const data = await res.json()
    if (data.error) return setMessage(data.error)

    const updated = { ...user, subscription_status: 'active', subscription_plan: plan }
    localStorage.setItem('user', JSON.stringify(updated))
    setMessage('Subscribed successfully!')
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 24 }}>
      <h2>Choose Your Plan</h2>
      <p style={{ color: 'gray', marginBottom: 24 }}>Subscribe to enter monthly draws and support your charity</p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>

        {/* Monthly Plan */}
        <div onClick={() => setPlan('monthly')} style={{
          flex: 1, padding: 24, borderRadius: 12, cursor: 'pointer',
          border: plan === 'monthly' ? '2px solid #0070f3' : '1px solid #eee',
          background: plan === 'monthly' ? '#f0f7ff' : 'white'
        }}>
          <h3>Monthly</h3>
          <p style={{ fontSize: 28, fontWeight: 'bold', margin: '8px 0' }}>£9.99</p>
          <p style={{ color: 'gray' }}>per month</p>
          <ul style={{ marginTop: 12, paddingLeft: 16, color: 'gray' }}>
            <li>Enter monthly draws</li>
            <li>Support your charity</li>
            <li>Track your scores</li>
          </ul>
        </div>

        {/* Yearly Plan */}
        <div onClick={() => setPlan('yearly')} style={{
          flex: 1, padding: 24, borderRadius: 12, cursor: 'pointer',
          border: plan === 'yearly' ? '2px solid #0070f3' : '1px solid #eee',
          background: plan === 'yearly' ? '#f0f7ff' : 'white'
        }}>
          <div style={{ background: '#0070f3', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 12, display: 'inline-block', marginBottom: 8 }}>
            SAVE 20%
          </div>
          <h3>Yearly</h3>
          <p style={{ fontSize: 28, fontWeight: 'bold', margin: '8px 0' }}>£95.99</p>
          <p style={{ color: 'gray' }}>per year</p>
          <ul style={{ marginTop: 12, paddingLeft: 16, color: 'gray' }}>
            <li>Enter monthly draws</li>
            <li>Support your charity</li>
            <li>Track your scores</li>
          </ul>
        </div>

      </div>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <button
        onClick={handleSubscribe}
        style={{
          width: '100%', padding: '14px', background: '#0070f3',
          color: 'white', border: 'none', borderRadius: 8,
          fontSize: 16, cursor: 'pointer'
        }}>
        Subscribe Now
      </button>

      <p style={{ color: 'gray', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        No real payment needed for demo. Click to activate.
      </p>
    </div>
  )
}