import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('winners')
    .select('*, users(name, email), draws(draw_date)')
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ winners: data })
}