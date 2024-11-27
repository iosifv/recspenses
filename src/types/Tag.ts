import { TagType } from "./TagType" // Import TagType for reference
import { User } from "./User"

export type DBTag = {
  id: string
  name: string
  description: string
  type: string
}

export class Tag {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public type: TagType,
  ) {}

  static fromDB(dbTag: DBTag, user: User): Tag {
    const foundType = user.tagTypes.find((type) => type.id === dbTag.type)
    if (!foundType) {
      throw new Error(`Tag type ${dbTag.type} not found`)
    }
    return new Tag(dbTag.id, dbTag.name, dbTag.description, foundType)
  }

  static buildWithUnknownId(id: string): Tag {
    return new Tag(id, "Unknown", "A tag that has been deleted", TagType.buildWithUnknownId(id))
  }
}
