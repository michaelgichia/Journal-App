import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Define the shape of the response data
interface SummaryResponse {
  totalEntries: number;
  avgWordCount: number;
  mostUsedCategory: string;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const userId = searchParams.get('userId');

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: 'startDate and endDate are required' },
      { status: 400 },
    );
  }

  try {
    // Total Entries
    const totalEntriesResult = await sql`
      SELECT COUNT(*) AS total_entries
      FROM Journals
      WHERE user_id = ${userId}
      AND created_at BETWEEN ${startDate} AND ${endDate};
    `;

    // Average Word Count
    const avgWordCountResult = await sql`
      SELECT AVG(ARRAY_LENGTH(STRING_TO_ARRAY(content, ' '), 1)) AS avg_word_count
      FROM Journals
      WHERE user_id = ${userId} AND created_at BETWEEN ${startDate} AND ${endDate};
    `;

    // Most Used Category
    const mostUsedCategoryResult = await sql`
      SELECT c.name AS category_name, COUNT(je.id) AS entry_count
      FROM Journals je
      JOIN Categories c ON je.category_id = c.id
      WHERE je.user_id = ${userId}
      AND je.created_at BETWEEN ${startDate} AND ${endDate}
      GROUP BY c.name
      ORDER BY entry_count DESC
      LIMIT 1;
    `;

    const totalEntries = Number(totalEntriesResult.rows[0].total_entries);
    const avgWordCount = Math.round(Number(avgWordCountResult.rows[0]?.avg_word_count || 0));
    const mostUsedCategory = mostUsedCategoryResult.rows[0]?.category_name || 'None';

    const data: SummaryResponse = {
      totalEntries,
      avgWordCount,
      mostUsedCategory,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Database error:', error); // Log the actual error
    return NextResponse.json(
      { error: 'Failed to fetch summary data' },
      { status: 500 },
    );
  }
}