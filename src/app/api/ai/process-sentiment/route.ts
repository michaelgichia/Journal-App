/**
 * Sentiment Analysis API Route
 *
 * This route processes journal entries to analyze emotional content using Hugging Face's
 * RoBERTa model fine-tuned for emotion classification. It's designed to provide
 * real-time emotional insights for journal entries.
 *
 * @module process-sentiment
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/config/auth'
import hf from '@/hf';

/**
 * POST handler for sentiment analysis
 *
 * This endpoint:
 * 1. Authenticates the user to ensure only authorized users can analyze their entries
 * 2. Processes the journal entry text to identify emotional content
 * 3. Returns the dominant emotion with its confidence score
 *
 * @param {NextRequest} req - The incoming request containing the journal entry
 * @returns {Promise<NextResponse>} Response containing the emotion analysis or error
 * @throws {Error} When authentication fails or processing errors occur
 */
export async function POST(req: NextRequest) {
  // Authenticate user to ensure secure access to AI processing
  const session = await auth()
  const userId = session?.user?.id

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extract journal entry from query parameters
  // Using query params instead of body to support larger text entries
  const searchParams = req.nextUrl.searchParams;
  const journalEntry = searchParams.get('journalEntry');

  if (!journalEntry) {
    return NextResponse.json({ error: 'Journal entry is required' }, { status: 400 });
  }

  try {
    // Use RoBERTa model fine-tuned for emotion classification
    // This model provides granular emotional insights compared to basic sentiment analysis
    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: journalEntry,
    });

    console.log('[[Emotion Analysis Result]]', result);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Failed to analyze emotions' }, { status: 500 });
    }

    // Return the most confident emotion prediction
    // The first result has the highest confidence score
    return NextResponse.json(
      result[0], // the first sentiment in the list has the highest score.
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing sentiment:', error);
    return NextResponse.json({ error: 'Failed to process sentiment' }, { status: 500 });
  }
}

export const config = {
  runtime: 'nodejs',
};