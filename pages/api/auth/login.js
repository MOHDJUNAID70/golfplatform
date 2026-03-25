import supabase from '../../../lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  const { email, password } = req.body

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) return res.status(400).json({ error: 'User not found' })

  const isValid = await bcrypt.compare(password, data.password)
  if (!isValid) return res.status(400).json({ error: 'Wrong password' })

  const token = jwt.sign(
    { id: data.id, email: data.email, role: data.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  return res.status(200).json({ token, user: data })
}