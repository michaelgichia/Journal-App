'use client'

import {useState, useActionState} from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {Eye, EyeOff} from '@/app/ui/icons'
import {register} from '@/app/actions/auth'
import {IAuthState} from '@/types/auth'

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useActionState<IAuthState | undefined, FormData>(
    register,
    {
      message: null,
      success: false,
    },
  )

  return (
    <div className='flex min-h-screen'>
      {/* Left side - Form */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24'>
        <div className='max-w-md mx-auto w-full'>
          <h1 className='text-3xl font-bold mb-10'>Get Started Now</h1>
          <form action={formAction} className='space-y-6'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium mb-2'>
                Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                placeholder='Enter your name'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium mb-2'>
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>

            <div className='relative'>
              <label
                htmlFor='password'
                className='block text-sm font-medium mb-2'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-gray-500 hover:text-gray-700 p-1.5'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye height={20} width={20} />
                ) : (
                  <EyeOff height={20} width={20} className='text-black' />
                )}
                <span className='sr-only'>
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>

            <div className='flex items-center'>
              <input
                id='terms'
                name='terms'
                type='checkbox'
                required
                className='h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded'
              />
              <label
                htmlFor='terms'
                className='ml-2 block text-sm text-zinc-700'
              >
                I agree to the terms & policy
              </label>
            </div>

            {state && (
              <div className='text-red-500 text-sm'>{state?.message}</div>
            )}

            <button
              type='submit'
              className='w-full py-3 px-4 bg-green-700 hover:bg-green-800 text-white font-medium rounded-md transition duration-200'
            >
              Signup
            </button>
          </form>
          <div className='my-6 text-center text-sm text-gray-500'>
            <span>Or</span>
          </div>
          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              Have an account?{' '}
              <Link href='/login' className='text-green-600 hover:underline'>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className='hidden lg:block lg:w-1/2 relative overflow-hidden rounded-l-3xl'>
        <Image
          src='/back-splash.png'
          alt='back slash'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  )
}
