export class TagType {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public color: string,
  ) {}

  static buildWithUnknownId(id: string): TagType {
    return new TagType(id, "Deleted Tag Type", "A tag type that has been deleted", "#FF0000")
  }
}
