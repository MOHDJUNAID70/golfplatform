import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setLoading(false)
    if (data.error) return setError(data.error)
    router.push('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: 16, border: '1px solid #eee', width: '100%', maxWidth: 420 }}>

        <div onClick={() => router.push('/')} style={{ color: '#0070f3', fontWeight: 700, fontSize: 20, marginBottom: 28, cursor: 'pointer' }}>
          GolfGives
        </div>

        <h2 style={{ marginBottom: 6 }}>Create your account</h2>
        <p style={{ color: 'gray', fontSize: 14, marginBottom: 28 }}>Join golfers making a difference</p>

        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Full Name</label>
        <input
          placeholder="Mohd Junaid"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Email</label>
        <input
          placeholder="you@example.com"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, display: 'block' }}>Password</label>
        <input
          placeholder="••••••••"
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <button onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, marginTop: 4 }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'gray' }}>
          Already have an account?{' '}
          <span onClick={() => router.push('/login')} style={{ color: '#0070f3', cursor: 'pointer', fontWeight: 500 }}>
            Log in
          </span>
        </p>
      </div>
    </div>
  )
}