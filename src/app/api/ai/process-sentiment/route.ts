import { NextRequest, NextResponse } from 'next/server';
import {auth} from '@/config/auth'
import hf from '@/hf';

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id

  // Verify user authentication with Clerk
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const journalEntry = searchParams.get('journalEntry');

  if (!journalEntry) {
    return NextResponse.json({ error: 'Journal entry is required' }, { status: 400 });
  }

  try {

    // Analyze emotions
    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: journalEntry,
    });

    console.log('[[Emotion Analysis Result]]', result);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Failed to analyze emotions' }, { status: 500 });
    }

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