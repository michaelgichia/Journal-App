'use server'

import {sql} from '@vercel/postgres'
import {AuthError, CredentialsSignin} from 'next-auth'

import {IAuthState} from '@/types/auth'
import {signIn} from '@/config/auth'
import {getUser} from '@/app/db/auth'
import {saltAndHashPassword} from '@/utils/password'

/**
 * Authenticates a user using the provided form data.
 *
 * This function attempts to sign in a user with the given credentials.
 * If the sign-in is successful, it returns a success message.
 * If the sign-in fails due to invalid credentials or other authentication errors,
 * it returns an appropriate error message.
 *
 * @param {IAuthState | undefined} _prevState - The previous authentication state (not used in this function).
 * @param {FormData} formData - The form data containing the user's email and password.
 * @returns {Promise<IAuthState | undefined>} - A promise that resolves to the new authentication state.
 * @throws {Error} - Throws an error if an unexpected error occurs during authentication.
 */
export async function authenticate(
  _prevState: IAuthState | undefined,
  formData: FormData,
): Promise<IAuthState | undefined> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    })
    return {
      message: 'Successfully signed in!',
      success: true,
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case CredentialsSignin.type:
          return {
            message: 'Invalid credentials.',
            success: false,
          }
        default:
          return {
            message: 'Something went wrong.',
            success: false,
          }
      }
    }
    throw error
  }
}

/**
 * Registers a new user using the provided form data.
 *
 * This function attempts to create a new user account with the given credentials.
 * It validates the input fields, checks if the user already exists, hashes the password,
 * and inserts the new user into the database. If the registration is successful,
 * it returns a success message. If the registration fails due to validation errors,
 * existing user, or other errors, it returns an appropriate error message.
 *
 * @param {IAuthState | undefined} _state - The previous authentication state (not used in this function).
 * @param {FormData} formData - The form data containing the user's name, email, and password.
 * @returns {Promise<IAuthState | undefined>} - A promise that resolves to the new authentication state.
 * @throws {Error} - Throws an error if an unexpected error occurs during registration.
 */
export async function register(
  _state: IAuthState | undefined,
  formData: FormData,
): Promise<IAuthState | undefined> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate inputs
  if (!name || !email || !password) {
    return {success: false, message: 'All fields are required'}
  }

  // Check if user exist
  const user = await getUser(email)
  if (user) return {success: false, message: 'Email address already taken.'}

  try {
    // Hash password
    const hashedPassword = await saltAndHashPassword(password)

    // Create user
    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `

    await signIn('credentials', {email, password, redirect: false})

    return {
      message: 'Successfully registered!',
      success: true,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {success: false, message: 'Failed to register user'}
  }
}
