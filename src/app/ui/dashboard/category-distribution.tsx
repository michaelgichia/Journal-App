'use client'

import {ResponsivePie} from '@nivo/pie'
import {Shuffle} from '@/app/ui/icons'
import {PieChartSkeleton} from '@/app/ui/skeletons'
import {CategoryDistribution} from '@/types/journal'

type IProps = {
  categories: CategoryDistribution[]
  loading: boolean
}

export default function CategoryPieChart({categories, loading}: IProps) {
  // Ensure categories with 0 entries are visible by assigning a small value
  const adjustedData = categories.map((item) => ({
    id: item.id,
    value: item.value === 0 ? 0.1 : item.value, // Small value for visibility
  }))

  return (
    <div className='shadow-sm flex flex-col mb-8'>
      <div className='flex pt-4 px-8'>
        <Shuffle />
        <h2 className='text-2xl pl-2 font-medium'>Category distribution</h2>
      </div>
      <div className='h-[400px] w-full flex items-center'>
        {loading ? (
          <PieChartSkeleton />
        ) : (
          <ResponsivePie
            data={adjustedData}
            margin={{top: 40, right: 80, bottom: 80, left: 80}}
            innerRadius={0.5}
            sortByValue
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{scheme: 'purpleRed_green'}}
            borderWidth={1}
            borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor='#333333'
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{from: 'color'}}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{from: 'color', modifiers: [['darker', 2]]}}
            legends={[
              {
                anchor: 'right',
                direction: 'column',
                justify: false,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'right-to-left',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
              },
            ]}
          />
        )}
      </div>
    </div>
  )
}
