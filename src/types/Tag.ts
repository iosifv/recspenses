import { TagType } from "./TagType" // Import TagType for reference
import { User } from "./User"
import { PlainObjectConvertible } from "./PlainObjectConvertible"

export type DBTag = {
  id: string
  name: string
  description: string
  color: string
  type: string
}

export class Tag implements PlainObjectConvertible {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public color: string,
    public type: TagType,
  ) {}

  // static fromDB(dbTag: DBTag, user: User): Tag {
  //   const foundType = user.tagTypes.find((type) => type.id === dbTag.type)
  //   if (!foundType) {
  //     throw new Error(`Tag type ${dbTag.type} not found`)
  //   }
  //   return new Tag(dbTag.id, dbTag.name, dbTag.description, dbTag.color, foundType)
  // }

  static buildWithUnknownId(id: string): Tag {
    return new Tag(
      id,
      "Unknown",
      "A tag that has been deleted",
      "#f22",
      TagType.buildWithUnknownId(id),
    )
  }

  toPlainObject(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      color: this.color,
      type: this.type
        ? {
            id: this.type.id,
            name: this.type.name,
            description: this.type.description,
            color: this.type.color,
          }
        : undefined,
    }
  }
}
