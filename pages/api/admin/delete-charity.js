import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { id } = req.body
  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', id)

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Charity deleted' })
}