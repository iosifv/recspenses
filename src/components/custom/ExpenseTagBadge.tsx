import { useRouter } from "next/navigation"

import { Badge } from "~/components/ui/badge"
import TrashIcon from "~/components/hero-icons/TrashIcon"

interface TagBadgeProps {
  expenseId: number
  tagId: string
  tagName: string
}

export const ExpenseTagBadge: React.FC<TagBadgeProps> = ({ expenseId, tagId, tagName }) => {
  const router = useRouter()

  const onDeleteTagButtonClick = (tagId: string) => async () => {
    await fetch(`/api/expense/${expenseId}/tag/${tagId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ expenseId: expenseId, tagId: tagId }),
    })
    router.refresh()
  }

  return (
    <Badge
      variant={"outline"}
      className="mr-2 mb-2 pt-0 pb-0 rounded-full cursor-default text-white text-xs hover:bg-gray-600"
      key={tagId}
    >
      {tagName}
      <div className="ml-2 p-1 cursor-pointer" onClick={onDeleteTagButtonClick(tagId)}>
        <TrashIcon />
      </div>
    </Badge>
  )
}
