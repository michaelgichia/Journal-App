'use server'

import { IAuthState } from '@/types/auth';

export async function authenticate(
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