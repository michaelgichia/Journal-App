'use client'

import {ResponsiveLine, Serie} from '@nivo/line'
import {PieChartSkeleton} from '@/app/ui/skeletons'
import {Send} from '@/app/ui/icons'

type IProps = {
  wordTrends: Serie[]
  loading: boolean
}

export default function WordCountTrendChart({wordTrends, loading}: IProps) {
  return (
    <div className='shadow-sm flex flex-col mb-8'>
      <div className='flex pt-4 px-8'>
        <Send />
        <h2 className='text-2xl pl-2 font-medium'>
          Word Count Trends Over Time
        </h2>
      </div>
      <div className='h-[400px] w-full flex items-center justify-center'>
        {loading && <PieChartSkeleton />}
        {!loading && wordTrends.length > 0 && wordTrends[0].data.length > 0 && (
          <ResponsiveLine
            data={wordTrends}
            margin={{top: 50, right: 50, bottom: 50, left: 60}}
            xScale={{type: 'time', format: '%Y-%m-%d', precision: 'day'}}
            xFormat='time:%Y-%m-%d'
            yScale={{type: 'linear', min: 0, max: 'auto'}}
            axisBottom={{
              format: '%b %d',
            }}
            axisLeft={{
              legend: 'Word Count',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
            colors={{scheme: 'nivo'}}
            pointSize={10}
            pointColor={{theme: 'background'}}
            pointBorderWidth={2}
            pointBorderColor={{from: 'serieColor'}}
            enablePoints={true} // Disable points for a cleaner line
            useMesh={true} // Enable interactivity
            enableGridX={true}
            enableArea={false} // Fill the area under the line
            areaOpacity={0.2}
          />
        )}

        {!loading &&
          wordTrends.length > 0 &&
          wordTrends[0].data.length === 0 && (
            <p className='text-gray-500'>
              <span>No data available</span>
            </p>
          )}
      </div>
    </div>
  )
}
