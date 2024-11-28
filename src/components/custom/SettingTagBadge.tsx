import { Badge } from "~/components/ui/badge"

import TrashIcon from "~/components/hero-icons/TrashIcon"

interface TagBadgeProps {
  id: string
  name: string
}

export const SettingTagBadge: React.FC<TagBadgeProps> = ({ id, name }) => {
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
      className="mr-2 mb-2 rounded-full cursor-default hover:bg-slate-500"
      key={id}
    >
      {name}
      {/* <span>(Tag description)</span> */}
      <div className="ml-2 p-1 cursor-pointer" onClick={onDeleteTagButtonClick(id)}>
        <TrashIcon />
      </div>
    </Badge>
  )
}
