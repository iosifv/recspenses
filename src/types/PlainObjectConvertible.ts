// Interface for plain object conversion
export interface PlainObjectConvertible {
  toPlainObject(): Record<string, any>
}
