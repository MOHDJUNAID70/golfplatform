import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 40px', borderBottom: '1px solid #eee'
      }}>
        <h2 style={{ margin: 0, color: '#0070f3' }}>GolfGives</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => router.push('/login')}
            style={{ padding: '8px 20px', border: '1px solid #0070f3', background: 'white', color: '#0070f3', borderRadius: 8, cursor: 'pointer' }}>
            Login
          </button>
          <button onClick={() => router.push('/signup')}
            style={{ padding: '8px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 24px 60px' }}>
        <div style={{ display: 'inline-block', background: '#e8f0fe', color: '#0070f3', padding: '6px 16px', borderRadius: 20, fontSize: 13, marginBottom: 20 }}>
          Play Golf. Win Prizes. Change Lives.
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.2 }}>
          Golf that gives back
        </h1>
        <p style={{ fontSize: 18, color: 'gray', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Subscribe, enter your scores, win monthly prizes — and automatically donate to a charity you care about.
        </p>
        <button onClick={() => router.push('/signup')}
          style={{
            padding: '16px 40px', background: '#0070f3', color: 'white',
            border: 'none', borderRadius: 10, fontSize: 18, cursor: 'pointer', fontWeight: 600
          }}>
          Start Playing →
        </button>
        <p style={{ color: 'gray', fontSize: 13, marginTop: 12 }}>From £9.99/month. Cancel anytime.</p>
      </div>

      {/* How it works */}
      <div style={{ background: '#f9fafb', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>How it works</h2>
        <div style={{ display: 'flex', gap: 24, maxWidth: 800, margin: '0 auto', flexWrap: 'wrap' }}>
          {[
            { step: '01', title: 'Subscribe', desc: 'Choose monthly or yearly plan. 10% goes to your charity automatically.' },
            { step: '02', title: 'Enter Scores', desc: 'Log your last 5 Stableford scores. Your numbers enter the monthly draw.' },
            { step: '03', title: 'Win Prizes', desc: 'Match 3, 4, or 5 numbers to win. Jackpot rolls over if unclaimed.' },
          ].map(item => (
            <div key={item.step} style={{ flex: 1, minWidth: 220, background: 'white', padding: 24, borderRadius: 12, border: '1px solid #eee' }}>
              <div style={{ fontSize: 13, color: '#0070f3', fontWeight: 700, marginBottom: 8 }}>{item.step}</div>
              <h3 style={{ margin: '0 0 8px' }}>{item.title}</h3>
              <p style={{ color: 'gray', margin: 0, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charities Section */}
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>Support a cause you believe in</h2>
        <p style={{ color: 'gray', marginBottom: 36 }}>Every subscription automatically donates to your chosen charity</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Cancer Research UK', 'Red Cross', 'WWF'].map(name => (
            <div key={name} style={{
              padding: '16px 28px', border: '1px solid #eee', borderRadius: 10,
              fontWeight: 500, background: 'white'
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: '#0070f3', padding: '60px 24px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: 36, margin: '0 0 16px' }}>Ready to play with purpose?</h2>
        <p style={{ marginBottom: 28, opacity: 0.85 }}>Join golfers making a difference every month</p>
        <button onClick={() => router.push('/signup')}
          style={{
            padding: '14px 36px', background: 'white', color: '#0070f3',
            border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer'
          }}>
          Subscribe Now
        </button>
      </div>

      {/* Footer */}
      <footer style={{ padding: '24px 40px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', color: 'gray', fontSize: 13 }}>
        <span>© 2026 GolfGives</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/login')}>Login</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/signup')}>Sign Up</span>
          <span style={{ cursor: 'pointer' }} onClick={() => router.push('/draws')}>Draws</span>
        </div>
      </footer>

    </div>
  )
}