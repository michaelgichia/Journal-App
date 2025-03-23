import { useState, useEffect } from 'react';
import { CalendarDatum } from '@nivo/calendar';
import { Serie } from '@nivo/line';
import { CategoryDistribution, EmotionCategory, Summary, DateFilter } from '@/types/journal';

interface JournalSummariesData {
  entries: CalendarDatum[];
  categories: CategoryDistribution[];
  wordTrends: Serie[];
  sentiments: EmotionCategory[];
  summary: Summary;
  isLoading: boolean;
  error: Error | null;
}

export function useJournalSummaries(dateFilter: DateFilter): JournalSummariesData {
  const [data, setData] = useState<JournalSummariesData>({
    entries: [],
    categories: [],
    wordTrends: [],
    sentiments: [],
    summary: {
      totalEntries: 0,
      avgWordCount: 0,
      mostUsedCategory: '',
    },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!dateFilter.startAt || !dateFilter.endAt) return;

      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        const [summaryRes, entriesRes, categoriesRes, wordTrendsRes, sentimentsRes] = await Promise.all([
          fetch(`/api/summary/aggregates?startDate=${dateFilter.startAt}&endDate=${dateFilter.endAt}`),
          fetch(`/api/summary/entry-frequency?startDate=${dateFilter.startAt}&endDate=${dateFilter.endAt}`),
          fetch(`/api/summary/category-distribution?startDate=${dateFilter.startAt}&endDate=${dateFilter.endAt}`),
          fetch(`/api/summary/word-count-trends?startDate=${dateFilter.startAt}&endDate=${dateFilter.endAt}`),
          fetch(`/api/summary/sentiment-summary?startDate=${dateFilter.startAt}&endDate=${dateFilter.endAt}`),
        ]);

        if (!summaryRes.ok || !entriesRes.ok || !categoriesRes.ok || !wordTrendsRes.ok || !sentimentsRes.ok) {
          throw new Error('Failed to fetch summary data');
        }

        const [summary, entries, categories, wordTrends, sentiments] = await Promise.all([
          summaryRes.json(),
          entriesRes.json(),
          categoriesRes.json(),
          wordTrendsRes.json(),
          sentimentsRes.json(),
        ]);

        setData({
          entries: entries.map(({ entrydate, entrycount }: { entrydate: string; entrycount: number }) => ({
            day: entrydate,
            value: entrycount,
          })),
          categories,
          wordTrends,
          sentiments,
          summary,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('An unknown error occurred'),
        }));
      }
    };

    fetchData();
  }, [dateFilter.startAt, dateFilter.endAt]);

  return data;
}