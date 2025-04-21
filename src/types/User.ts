import { Tag, DBTag } from "./Tag"
import { TagType } from "./TagType"
import { PlainObjectConvertible } from "./PlainObjectConvertible"

export type DBUser = {
  userId: string
  tags: DBTag[] // stored as JSON in DB, usually Tag[] or tag ids
  tagTypes: TagType[] // stored as JSON in DB, usually TagType[] or tag type ids
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null
}

export class User implements PlainObjectConvertible {
  userId: string
  tags: Tag[] // stored as JSON in DB
  tagTypes: TagType[] // stored as JSON in DB
  metadata: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date | null
  seenAt: Date | null

  constructor(dbUser: DBUser) {
    this.userId = dbUser.userId
    this.metadata = dbUser.metadata
    this.createdAt = dbUser.createdAt
    this.updatedAt = dbUser.updatedAt
    this.seenAt = dbUser.seenAt

    // console.log("BACKEND - user.constructor()", dbUser.tags)

    this.tagTypes = dbUser.tagTypes.map((tagType) => {
      // console.log(tagType)
      return new TagType(tagType.id, tagType.name, tagType.description, tagType.color)
    })

    this.tags = dbUser.tags.map((tag: DBTag) => {
      // console.log("this.tagTypes", this.tagTypes)
      // console.log("tag", tag)
      const foundType = this.tagTypes.find((tt: TagType) => tt.id === tag.type)
      // console.log("foundType", foundType)
      if (!foundType) {
        return Tag.buildWithUnknownId(tag.id)
      }
      return new Tag(tag.id, tag.name, tag.description, tag.color, foundType)
    })
  }

  toPlainObject(): Record<string, any> {
    // console.log("user.toPlainObject() - this.tags", this.tags)
    return {
      userId: this.userId,
      tags: this.tags.map((tag) =>
        typeof tag.toPlainObject === "function" ? tag.toPlainObject() : tag,
      ),
      tagTypes: this.tagTypes.map((tt) => ({
        id: tt.id,
        name: tt.name,
        description: tt.description,
        color: tt.color,
      })),
      metadata: this.metadata,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
      updatedAt:
        this.updatedAt instanceof Date
          ? this.updatedAt
            ? this.updatedAt.toISOString()
            : null
          : this.updatedAt,
      seenAt:
        this.seenAt instanceof Date
          ? this.seenAt
            ? this.seenAt.toISOString()
            : null
          : this.seenAt,
    }
  }
}
