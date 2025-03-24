import {CalendarDatum} from '@nivo/calendar'
import { Serie } from '@nivo/line'

export type Journal = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: string
  userId: string
  category: string
  category_id: string
}

export type Category = {
  id: string
  name: string
  type: string
  created_at: string
}

export interface DateFilter {
  startAt: string
  endAt: string
}

export interface JournalSummary {
  totalEntries: number
  avgWordCount: number
  mostUsedCategory: string
  dominantSentiment?: string
}

export interface JournalEntry {
  date: string
  count: number
}

export interface CategoryCount {
  name: string
  count: number
}

export interface WordTrend {
  date: string
  count: number
}

export interface SentimentCount {
  sentiment: string
  count: number
}

export interface JournalSummariesResponse {
  entries: CalendarDatum[]
  categories: CategoryDistribution[]
  wordTrends: Serie[]
  sentiments: EmotionCategory[]
  summary: JournalSummary
  isLoading: boolean
  error: Error | null
}

export interface Summary {
  totalEntries: number
  avgWordCount: number
  mostUsedCategory: string
}

export interface CategoryDistribution {
  id: string
  value: number
}

export type EmotionCategory = {
  id: string;
  value: number;
};