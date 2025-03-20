import {ZodError} from 'zod'
import Credentials from 'next-auth/providers/credentials'
import type {Provider} from 'next-auth/providers'

import {comparePasswords} from '@/utils/password'
import {getUser} from '@/app/db/auth'
import {signInSchema} from '@/schema/auth'

export const providers: Provider[] = [
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        // Validate credentials first
        const {email, password} = await signInSchema.parseAsync(credentials)

        // Get user BEFORE hashing
        const user = await getUser(email)
        if (!user) throw new Error('User not found')

        // Compare input password with STORED hash
        const isMatch = await comparePasswords(
          password,
          user.password, // Use stored hash from DB
        )

        if (!isMatch) return null

        return user
      } catch (error) {
        if (error instanceof ZodError) {
          // Consider logging validation errors
          return null
        }
        // Return null instead of throwing to prevent server errors
        return null
      }
    },
  }),
]
