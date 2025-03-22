import {Power} from '@/app/ui/icons'
import {signOut} from '@/config/auth'

import NavLinks from '@/app/ui/dashboard/nav-links'

export default function SideNav() {
  return (
    <div className='flex h-full flex-col md:px-2'>
      <div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
        <div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block md:px-2 md:pt-10'>
          <NavLinks />
        </div>
        <form
          action={async () => {
            'use server'
            await signOut({redirectTo: '/'})
          }}
        >
          <button className='flex h-[48px] bg-gray-50 w-full grow items-center justify-center gap-2 rounded-md  p-3 text-sm font-medium hover:bg-teal-50 hover:text-teal-800 md:flex-none md:justify-start md:p-2 md:px-3 cursor-pointer'>
            <Power className='w-6' />
            <div className='hidden md:block'>Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  )
}
