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

export interface Summary {
  totalEntries: number
  avgWordCount: number
  mostUsedCategory: string
}

export interface CategoryDistribution {
  id: string
  value: number
}