import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  const { user_id, plan } = req.body

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      subscription_plan: plan
    })
    .eq('id', user_id)

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ message: 'Subscription activated' })
}