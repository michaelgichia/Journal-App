/**
 * Journal Summary Aggregates API Route
 *
 * This route provides high-level statistics about a user's journal entries
 * within a specified date range. It calculates key metrics including total
 * entries, average word count, and most frequently used category.
 *
 * @module aggregates
 */

import { sql } from '@vercel/postgres';
import { NextResponse, type NextRequest } from 'next/server';
import {auth} from '@/config/auth'

/**
 * Interface defining the structure of the summary response
 * @interface SummaryResponse
 * @property {number} totalEntries - Total number of journal entries in the date range
 * @property {number} avgWordCount - Average number of words per entry
 * @property {string} mostUsedCategory - Category with the highest number of entries
 */
interface SummaryResponse {
  totalEntries: number;
  avgWordCount: number;
  mostUsedCategory: string;
}

/**
 * GET handler for journal summary aggregates
 *
 * This endpoint:
 * 1. Authenticates the user
 * 2. Calculates aggregate statistics for the specified date range
 * 3. Returns a comprehensive summary of journal activity
 *
 * @param {NextRequest} req - The incoming request containing date range parameters
 * @returns {Promise<NextResponse>} Response containing the summary statistics or error
 * @throws {Error} When authentication fails or processing errors occur
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

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
    const mostUsedCategory = mostUsedCategoryResult.rows[0]?.category_name || 'No data';

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

export const config = {
  runtime: 'nodejs',
};