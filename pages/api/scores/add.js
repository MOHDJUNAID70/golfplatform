import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { user_id, score, date } = req.body

  // Get current scores for user
  const { data: existing } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: true })

  // If already 5 scores, delete the oldest
  if (existing && existing.length >= 5) {
    await supabase
      .from('scores')
      .delete()
      .eq('id', existing[0].id)
  }

  // Insert new score
  const { data, error } = await supabase
    .from('scores')
    .insert([{ user_id, score, date }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Score added', score: data[0] })
}