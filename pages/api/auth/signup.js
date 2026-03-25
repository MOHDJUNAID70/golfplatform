import supabase from '../../../lib/supabase'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  const { name, email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }])
    .select()

  if (error) return res.status(400).json({ error: error.message })

  return res.status(200).json({ message: 'Signup successful', user: data[0] })
}