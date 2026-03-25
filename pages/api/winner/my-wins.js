import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { user_id } = req.query

  const { data, error } = await supabase
    .from('winners')
    .select('*, draws(draw_date)')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ winners: data })
}