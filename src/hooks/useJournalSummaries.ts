import { useState, useEffect } from 'react';
import { CalendarDatum } from '@nivo/calendar';
import { Serie } from '@nivo/line';
import { CategoryDistribution, EmotionCategory, Summary, DateFilter, JournalSummariesResponse } from '@/types/journal';

interface JournalSummariesData {
  entries: CalendarDatum[];
  categories: CategoryDistribution[];
  wordTrends: Serie[];
  sentiments: EmotionCategory[];
  summary: Summary;
  isLoading: boolean;
  error: Error | null;
}

export const useJournalSummaries = (dateFilter: DateFilter): JournalSummariesResponse => {
  const [data, setData] = useState<Omit<JournalSummariesResponse, 'isLoading' | 'error'>>({
    entries: [],
    categories: [],
    wordTrends: [],
    sentiments: [],
    summary: {
      totalEntries: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implement actual API call here
        const response = await fetch('/api/journal/summaries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dateFilter),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch journal summaries');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [dateFilter]);

  return {
    ...data,
    isLoading,
    error,
  };
};