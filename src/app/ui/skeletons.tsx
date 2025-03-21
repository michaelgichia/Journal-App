// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent'

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm flex flex-col h-[262px]`}
    >
      <div className='flex p-4'>
        <div className='h-8 w-8 rounded-md bg-gray-200' />
      </div>
      <div className='flex flex-col items-center justify-center truncate rounded-xl bg-white px-4 py-8 '>
        <div className='ml-2 h-8 w-full rounded-md bg-gray-200 text-sm font-medium mb-2' />
        <div className='ml-2 h-8 w-full rounded-md bg-gray-200 text-sm font-medium mb-2' />
        <div className='h-10 w-40 rounded-md bg-gray-200' />
        <div className='ml-2 h-8 w-full rounded-md bg-gray-200 text-sm font-medium mt-2' />
      </div>
    </div>
  )
}

export function CardsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}
