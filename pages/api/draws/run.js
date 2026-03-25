import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { draw_id } = req.body

  if (!draw_id) return res.status(400).json({ error: 'draw_id is required' })

  // Get draw
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('id', draw_id)
    .single()

  if (drawError) return res.status(400).json({ error: drawError.message })

  if (!draw) return res.status(404).json({ error: 'Draw not found' })

  const winningNums = (draw.winning_numbers || []).map(n => Number(n))

  // Get all active subscribers with scores
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, name')
    .eq('subscription_status', 'active')

  if (usersError) return res.status(400).json({ error: usersError.message })

  const winners = []

  for (const user of users || []) {
    const { data: scores, error: scoresError } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user.id)

    if (scoresError) return res.status(400).json({ error: scoresError.message })

    const userScores = (scores || []).map(s => Number(s.score))

    // Compare normalized numeric values so text/int DB types both match.
    const matches = userScores.filter(s => winningNums.includes(s)).length

    let match_type = null
    let prize_amount = 0

    if (matches >= 5) { match_type = '5-match'; prize_amount = 500 }
    else if (matches === 4) { match_type = '4-match'; prize_amount = 100 }
    else if (matches === 3) { match_type = '3-match'; prize_amount = 25 }

    if (match_type) {
      winners.push({ user_id: user.id, draw_id, match_type, prize_amount, payment_status: 'pending' })
    }
  }

  // Insert winners
  if (winners.length > 0) {
    const { error: winnersError } = await supabase.from('winners').insert(winners)
    if (winnersError) return res.status(400).json({ error: winnersError.message })
  }

  // Update draw status to published
  const { error: drawUpdateError } = await supabase
    .from('draws')
    .update({ status: 'published' })
    .eq('id', draw_id)

  if (drawUpdateError) return res.status(400).json({ error: drawUpdateError.message })

  return res.status(200).json({ message: 'Draw completed', winners })
}