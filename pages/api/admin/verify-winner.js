import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { winner_id, action } = req.body
  // action = 'approve' or 'reject'

  const payment_status = action === 'approve' ? 'paid' : 'rejected'

  const { error } = await supabase
    .from('winners')
    .update({ payment_status })
    .eq('id', winner_id)

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: `Winner ${payment_status}` })
}