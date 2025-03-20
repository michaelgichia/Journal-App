import {sql} from '@vercel/postgres'

import {User} from '@/types/auth'

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const {rows} =
      await sql<User>`SELECT id, name, email, password FROM users WHERE email = ${email}`
    return rows[0]
  } catch {
    return undefined
  }
}
