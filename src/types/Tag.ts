import { TagType } from "./TagType" // Import TagType for reference

export type DBTag = {
  id: string
  name: string
  color?: string
  type: string
}

export type Tag = {
  id: string
  name: string
  color?: string
  type: TagType
}
