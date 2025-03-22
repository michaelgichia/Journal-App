import {CalendarDatum, ResponsiveCalendar} from '@nivo/calendar'
import {HeatmapSkeleton} from '@/app/ui/skeletons'
import {Activity} from '@/app/ui/icons'

type IProps = {
  entries: CalendarDatum[]
  loading: boolean
}

export default function EntriesFrequency({entries, loading}: IProps) {
  return (
    <div className='shadow-sm flex flex-col mb-8'>
      <div className='flex pt-4 px-8'>
        <Activity />
        <h2 className='text-2xl pl-2 font-medium'>Entry frequency</h2>
      </div>
      <div
        className='h-[200px] w-full flex items-center'
      >
        {loading ? (
          <HeatmapSkeleton />
        ) : (
          <ResponsiveCalendar
            data={entries}
            from='2025-01-01'
            to='2025-12-31'
            emptyColor='#eeeeee'
            colors={[
              'oklch(0.855 0.138 181.071)',
              'oklch(0.704 0.14 182.503)',
              'oklch(0.6 0.118 184.704)',
              'oklch(0.386 0.063 188.416)',
            ]}
            margin={{top: 40, right: 40, bottom: 40, left: 40}}
            yearSpacing={40}
            monthBorderColor='#ffffff'
            dayBorderWidth={2}
            dayBorderColor='#ffffff'
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left',
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}
