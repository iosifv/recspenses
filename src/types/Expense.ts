import { Tag } from "./Tag"
import { TagType } from "./TagType"
import { User } from "./User" // Import User for reference
import { CURRENCIES, FREQUENCIES } from "~/types/CustomEnum"

export type DBExpense = {
  id?: number
  userId: string
  tags: string[] // stored as JSON in DB
  name: string
  amount: number
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  extra: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date
}

// /**
//  * @deprecated
//  */
// export type SimplifiedExpense = {
//   id?: number
//   name: string
//   amount: number
//   currency: (typeof CURRENCIES)[number]
//   frequency: (typeof FREQUENCIES)[number]
//   tags: {
//     id: string; name: string, tagTypeColour: string, tagColour: string
//   }[]
//   createdAt: Date
//   updatedAt: Date
// }

// export type FrontendExpense = {
//   id?: number
//   name: string
//   amount: number
//   currency: (typeof CURRENCIES)[number]
//   frequency: (typeof FREQUENCIES)[number]
//   tags: {
//     id: string; name: string, tagTypeColour: string, tagColour: string
//   }[]
//   createdAt: Date
//   updatedAt: Date
// }

import { PlainObjectConvertible } from "./PlainObjectConvertible"

export class Expense implements PlainObjectConvertible {
  id?: number
  userId: string
  tags: Tag[] // stored as JSON in DB
  name: string
  amount: number
  currency: (typeof CURRENCIES)[number]
  frequency: (typeof FREQUENCIES)[number]
  extra: Record<string, unknown> // stored as JSON in DB
  createdAt: Date
  updatedAt: Date

  constructor(user: User, dbExpense: DBExpense) {
    this.id = dbExpense.id
    this.userId = dbExpense.userId
    this.name = dbExpense.name
    this.amount = dbExpense.amount
    this.currency = dbExpense.currency
    this.frequency = dbExpense.frequency
    this.extra = dbExpense.extra
    this.createdAt = dbExpense.createdAt
    this.updatedAt = dbExpense.updatedAt

    this.tags = dbExpense.tags.map((tagId) => {
      const foundTag = user.tags.find((tag) => tag.id === tagId)
      if (foundTag) {
        // Ensure TagType is hydrated
        let hydratedType = foundTag.type
        if (!hydratedType || !hydratedType.id) {
          // Try to find TagType by tag type id
          hydratedType =
            user.tagTypes.find((tt) => tt.id === (foundTag.type?.id || foundTag.type)) ||
            TagType.buildWithUnknownId(foundTag.type?.id || "unknown")
        }
        return new Tag(
          foundTag.id,
          foundTag.name,
          foundTag.description,
          foundTag.color,
          hydratedType,
        )
      } else {
        return Tag.buildWithUnknownId(tagId)
      }
    })
  }

  // toSimplifiedExpense(): SimplifiedExpense {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     amount: this.amount,
  //     currency: this.currency,
  //     frequency: this.frequency,
  //     tags: this.tags.map((tag) => ({
  //       id: tag.id, name: tag.name, tagTypeColour: tag.type.color, tagColour: '#fff'
  //     })),
  //     createdAt: this.createdAt,
  //     updatedAt: this.updatedAt,
  //   }
  // }

  // toFrontendExpense(): FrontendExpense {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     amount: this.amount,
  //     currency: this.currency,
  //     frequency: this.frequency,
  //     tags: this.tags.map((tag: Tag) => ({
  //       id: tag.id,
  //       name: tag.name,
  //       tagTypeColour: tag.type.color,
  //       tagColour: '#fff'
  //     })),
  //     createdAt: this.createdAt,
  //     updatedAt: this.updatedAt,
  //   }
  // }

  // errorrMessages: string[] = []
  // validate(): boolean {
  //   if (this.name.trim() === "") {
  //     this.errorrMessages.push("Expense name can not be empty")
  //   }
  //   if (this.amount <= 0) {
  //     this.errorrMessages.push("Expense amount must be greater than 0")
  //   }
  //   if (this.currency.trim() === "") {
  //     this.errorrMessages.push("Expense currency can not be empty")
  //   }
  //   if (this.frequency.trim() === "") {
  //     this.errorrMessages.push("Expense frequency can not be empty")
  //   }
  //   if (this.errorrMessages.length > 0) {
  //     return false
  //   }

  //   return true
  // }

  // // Todo: move this only for the frontend object
  // getErrorMessages(): string[] {
  //   return this.errorrMessages
  //   }

  toPlainObject(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      tags: this.tags.map((tag) =>
        typeof tag.toPlainObject === "function" ? tag.toPlainObject() : tag,
      ),
      name: this.name,
      amount: this.amount,
      currency: this.currency,
      frequency: this.frequency,
      extra: this.extra,
      createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
      updatedAt: this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt,
    }
  }
}
