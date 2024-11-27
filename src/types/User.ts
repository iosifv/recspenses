import { Tag } from "./Tag"
import { TagType } from "./TagType"

export type User = {
  userId: string
  tags: Tag[] // stored as JSON in DB
  tagTypes: TagType[] // stored as JSON in DB
  metadata: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null
}
