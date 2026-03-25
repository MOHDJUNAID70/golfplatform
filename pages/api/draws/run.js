import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { draw_id } = req.body

  // Get draw
  const { data: draw } = await supabase
    .from('draws')
    .select('*')
    .eq('id', draw_id)
    .single()

  if (!draw) return res.status(404).json({ error: 'Draw not found' })

  const winningNums = draw.winning_numbers

  // Get all active subscribers with scores
  const { data: users } = await supabase
    .from('users')
    .select('id, name')
    .eq('subscription_status', 'active')

  const winners = []

  for (const user of users) {
    const { data: scores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', user.id)

    const userScores = scores.map(s => s.score)
    const matches = userScores.filter(s => winningNums.includes(s)).length

    let match_type = null
    let prize_amount = 0

    if (matches >= 5) { match_type = '5-match'; prize_amount = 500 }
    else if (matches === 4) { match_type = '4-match'; prize_amount = 100 }
    else if (matches === 3) { match_type = '3-match'; prize_amount = 25 }

    if (match_type) {
      winners.push({ user_id: user.id, draw_id, match_type, prize_amount })
    }
  }

  // Insert winners
  if (winners.length > 0) {
    await supabase.from('winners').insert(winners)
  }

  // Update draw status to published
  await supabase
    .from('draws')
    .update({ status: 'published' })
    .eq('id', draw_id)

  return res.status(200).json({ message: 'Draw completed', winners })
}