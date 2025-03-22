import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'

type WordCountTrend = {
  x: string
  y: number
}

type WordCountSeries = {
  id: string
  data: WordCountTrend[]
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    if (!userId) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const searchParams = req.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const {rows} = await sql`
      SELECT
        TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS entry_date,
        SUM(
          LENGTH(content) - LENGTH(REGEXP_REPLACE(content, '\s+', '', 'g')) + 1
        ) AS word_count
      FROM journals
      WHERE
        user_id = ${userId}
        AND created_at >= ${startDate}::date
        AND created_at < ${endDate}::date
      GROUP BY DATE(created_at)
      ORDER BY entry_date
    `

    const trendData: WordCountTrend[] = rows.map((row) => ({
      x: row.entry_date,
      y: Number(row.word_count) || 0,
    }))

    const series: WordCountSeries[] = [
      {
        id: 'word_count',
        data: trendData,
      },
    ]

    return NextResponse.json(series)
  } catch (error) {
    console.error('Error fetching word count trends:', error)
    return NextResponse.json(
      {error: 'Failed to fetch word count trends'},
      {status: 500},
    )
  }
}

export const config = {
  runtime: 'nodejs',
};