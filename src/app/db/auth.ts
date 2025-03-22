import {sql} from '@vercel/postgres'

import {User} from '@/types/auth'

/**
 * Retrieves a user by their email address from the database.
 *
 * This function implements a secure user lookup system with these key features:
 * - Uses parameterized queries to prevent SQL injection
 * - Returns undefined instead of throwing errors for security
 * - Selects only necessary user fields (id, name, email, password)
 *
 * Security considerations:
 * - Silent failure on database errors to prevent user enumeration
 * - No exposure of internal error details
 * - Minimal data exposure through selective field selection
 *
 * Performance considerations:
 * - Assumes email field is indexed for fast lookups
 * - Returns single row directly to minimize memory usage
 * - Uses type-safe query with User type for runtime safety
 *
 * @param {string} email - The email address of the user to retrieve
 * @returns {Promise<User | undefined>} - The user object if found, undefined if not found or on error
 */
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const {rows} =
      await sql<User>`SELECT id, name, email, password FROM users WHERE email = ${email}`
    return rows[0]
  } catch {
    return undefined
  }
}
