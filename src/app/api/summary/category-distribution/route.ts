import {sql} from '@vercel/postgres'
import {NextResponse, type NextRequest} from 'next/server'
import {auth} from '@/config/auth'

type CategoryDistribution = {
  id: string // Category name
  value: number // Number of entries in this category
}

export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  const searchParams = req.nextUrl.searchParams
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!startDate || !endDate) {
    return NextResponse.json(
      {error: 'startDate and endDate are required'},
      {status: 400},
    )
  }

  try {
    const {rows} = await sql`
      SELECT
        c.name AS category_name,
        COUNT(j.id) AS entry_count
      FROM categories c
      LEFT JOIN journals j
        ON j.category_id = c.id
        AND j.created_at BETWEEN ${startDate} AND ${endDate}
      GROUP BY c.name
      ORDER BY entry_count DESC
    `

    const distribution: CategoryDistribution[] = rows.map((row) => ({
      id: row.category_name,
      value: Number(row.entry_count),
    }))

    return NextResponse.json(distribution)
  } catch (error) {
    console.error('Error fetching category distribution:', error)
    return NextResponse.json(
      {error: 'Failed to fetch category distribution'},
      {status: 500},
    )
  }
}
