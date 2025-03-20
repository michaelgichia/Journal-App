'use server'

import {AuthError, CredentialsSignin} from 'next-auth'

import { IAuthState } from '@/types/auth';
import {signIn} from '@/config/auth'

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

export async function register(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: IAuthState | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData: FormData,
): Promise<IAuthState | undefined> {
  try {
    return {
      message: 'Successfully signed in!',
      success: true,
    }
  } catch (error) {
    throw error
  }
}