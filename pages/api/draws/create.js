import supabase from '../../../lib/supabase'

export default async function handler(req, res) {
  // Generate 5 random numbers between 1-45
  const winning_numbers = []
  while (winning_numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1
    if (!winning_numbers.includes(num)) {
      winning_numbers.push(num)
    }
  }

  const { data, error } = await supabase
    .from('draws')
    .insert([{
      draw_date: new Date().toISOString().split('T')[0],
      status: 'pending',
      winning_numbers
    }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ draw: data[0] })
}