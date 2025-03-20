import Image from 'next/image'
import Link from 'next/link'
import {ArrowRight} from './icons'

export default async function Home() {
  return (
    <div className='flex min-h-screen'>
      <div className='w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16'>
        <div className='max-w-md mx-auto w-full'>
          <h1 className='text-5xl font-[400] mb-24 text-center'>
            Write your daily and read them in exciting way
          </h1>
          <div className='flex gap-4 mt-8'>
            <Link
              href='/login'
              className='flex flex-1 items-center justify-between gap-5 self-start rounded-lg border border-emerald-700 bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-600 md:text-base'
            >
              <span>Log in</span>
              <ArrowRight />
            </Link>
            <Link
              href='/signup'
              className='flex flex-1 items-center justify-center gap-5 self-start rounded-lg text-emerald-700 border border-emerald-700 px-6 py-3 text-sm font-medium  transition-colors hover:bg-emerald-600 hover:border-emerald-600 hover:text-white md:text-base'
            >
              <span>Sign up</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className='hidden md:block md:w-1/2 relative overflow-hidden rounded-l-3xl'>
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
