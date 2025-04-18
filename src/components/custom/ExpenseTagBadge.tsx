import { useRouter } from "next/navigation"

import { Badge } from "~/components/ui/badge"
import TrashIcon from "~/components/hero-icons/TrashIcon"

interface TagBadgeProps {
  expenseId: number
  tagId: string
  tagName: string
  tagTypeColour: string
  tagColour: string
  canDelete: boolean
}

export const ExpenseTagBadge: React.FC<TagBadgeProps> = ({
  expenseId,
  tagId,
  tagName,
  tagTypeColour,
  tagColour,
  canDelete,
}) => {
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
      style={{
        borderColor: tagTypeColour,
        borderWidth: "2px",
        // display: "flex",
        // alignItems: "center",
      }}
      key={tagId}
    >
      {/* Dot with tagColour */}
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: tagColour,
          marginRight: 10,
        }}
      />
      {tagName}
      {canDelete && (
        <div className="ml-2 p-1 cursor-pointer" onClick={onDeleteTagButtonClick(tagId)}>
          <TrashIcon />
        </div>
      )}
    </Badge>
  )
}
