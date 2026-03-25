import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('charities')
    .select('*')

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ charities: data })
}