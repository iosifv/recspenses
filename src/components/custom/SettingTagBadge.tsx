import { Badge } from "~/components/ui/badge"

import TrashIcon from "~/components/hero-icons/TrashIcon"

import { Tag } from "~/types/Tag"

interface TagBadgeProps {
  tagObject: Tag
}

export const SettingTagBadge: React.FC<TagBadgeProps> = ({ tagObject }) => {
  const onDeleteTagButtonClick = (tagId: string) => async () => {
    await fetch("/api/user/tag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagId: tagId }),
    })
    // router.refresh()
  }

  return (
    <Badge
      variant={"default"}
      className="mr-2 mb-2 rounded-full cursor-default hover:opacity-80 text-white"
      key={tagObject.id}
      style={{ backgroundColor: tagObject.color }}
    >
      {tagObject.name}
      {/* <span>(Tag description)</span> */}
      <div className="ml-2 p-1 cursor-pointer" onClick={onDeleteTagButtonClick(tagObject.id)}>
        <TrashIcon className="w-3 h-3" />
      </div>
    </Badge>
  )
}
