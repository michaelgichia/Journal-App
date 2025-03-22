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


export function SummaryCardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-50 p-3 shadow-sm flex flex-col h-[164px]`}
    >
      <div className='flex p-2'>
        <div className='h-6 w-18 rounded-md bg-gray-200' />
      </div>
      <div className='flex flex-col items-center justify-center truncate rounded-xl bg-white px-4 py-8 '>
        <div className='h-10 w-40 rounded-md bg-gray-200' />
      </div>
    </div>
  )
}

export function SummaryCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6'>
      <SummaryCardSkeleton />
      <SummaryCardSkeleton />
      <SummaryCardSkeleton />
    </div>
  )
}

export const HeatmapSkeleton = () => {
  const days = 365;
  const rows = 7;
  return (
    <div className="flex flex-col items-center bg-white p-4 animate-pulse">
      <div className="flex flex-wrap w-full max-w-[60rem]">
        {Array.from({ length: days }).map((_, index) => {
            const row = index % rows;
            return (
              <div
                key={index}
                className="w-3.5 h-3.5 m-[1px] bg-[#eee] animate-pulse"
                style={{
                  order: row,
                }}
              >
              </div>
            );
          })}
      </div>
    </div>
  );
};