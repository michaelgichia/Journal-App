"use client";

import {ResponsiveLine, Serie} from '@nivo/line'
import {HeatmapSkeleton} from '@/app/ui/skeletons'
import {Activity} from '@/app/ui/icons'

type IProps = {
  wordTrends: Serie[]
  loading: boolean
}

export default function WordCountTrendChart({wordTrends, loading}: IProps) {
  console.log({ wordTrends })

  return (
    <div className='shadow-sm flex flex-col mb-8'>
      <div className='flex pt-4 px-8'>
        <Activity />
        <h2 className='text-2xl pl-2 font-medium'>Word Count Trends Over Time</h2>
      </div>
      <div className='h-[200px] w-full flex items-center'>
        {loading ? (
          <HeatmapSkeleton />
        ) : (
          <ResponsiveLine
            data={wordTrends}
            margin={{top: 50, right: 50, bottom: 50, left: 60}}
            xScale={{type: 'time', format: '%Y-%m-%d', precision: 'day'}}
            xFormat='time:%Y-%m-%d'
            yScale={{type: 'linear', min: 0, max: 'auto'}}
            axisBottom={{
              format: '%b %d',
              tickValues: 'every 1 month',
              legend: 'Date',
              legendOffset: 36,
              legendPosition: 'middle',
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
            enablePoints={false} // Disable points for a cleaner line
            useMesh={true} // Enable interactivity
            enableGridX={false}
            enableArea={true} // Fill the area under the line
            areaOpacity={0.2}
          />
        )}
      </div>
    </div>
  )
}
