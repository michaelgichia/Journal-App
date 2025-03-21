export type Journal = {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: string
  userId: string
  category: string
}

export type Category = {
  id: string
  name: string
  type: string
  created_at: string
}
