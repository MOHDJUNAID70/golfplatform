import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { name, description } = req.body
  const { error } = await supabase
    .from('charities')
    .insert([{ name, description }])

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Charity added' })
}