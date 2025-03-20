import {Power} from '@/app/ui/icons'
import {signOut} from '@/config/auth'
import Link from 'next/link'

export default function SideNav() {
  return (
    <div className='flex h-full flex-col md:px-2'>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block md:pe-2 md:pt-10'>
          <Link
            href='/dashboard'
            className='flex h-[48px] grow items-center justify-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-teal-800 md:flex-none md:justify-start md:p-2 md:px-3 bg-sky-100 text-teal-800'
          >
            <p className='hidden md:block'>Home</p>
          </Link>
        </div>
        <form
          action={async () => {
            'use server'
            await signOut({redirectTo: '/'})
          }}
        >
          <button className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-teal-800 md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer'>
            <Power className='w-6' />
            <div className='hidden md:block'>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}
