import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { user_id, charity_id } = req.body

  const { error } = await supabase
    .from('users')
    .update({ charity_id })
    .eq('id', user_id)

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Charity updated' })
}