import { useRouter } from "next/navigation"

import { Badge } from "~/components/ui/badge"
import TrashIcon from "~/components/hero-icons/TrashIcon"
import PlusIcon from "../hero-icons/PlusIcon"

interface TagBadgeProps {
  selected: boolean
  expenseId: number
  tagId: string
  tagName: string
  tagTypeColour?: string
  tagColour?: string
  actionToHappen: () => void
}

export const SimpleTagBadge: React.FC<TagBadgeProps> = ({
  selected,
  expenseId,
  tagId,
  tagName,
  tagTypeColour,
  tagColour,
  actionToHappen,
}) => {
  const router = useRouter()

  // console.log("--------", tagTypeColour, tagColour)

  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className={`mr-2 mb-2 pt-0 pb-0 rounded-full cursor-pointer text-xs hover:bg-gray-600 ${selected ? "text-white" : ""}`}
      style={{
        borderColor: tagTypeColour,
        borderWidth: "2px",
      }}
      key={tagId}
      onClick={actionToHappen}
    >
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
      <div className="ml-2 p-1">{selected ? <TrashIcon /> : <PlusIcon />}</div>
    </Badge>
  )
}
