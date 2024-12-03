import { useRouter } from "next/navigation"

import { Badge } from "~/components/ui/badge"
import TrashIcon from "~/components/hero-icons/TrashIcon"
import PlusIcon from "../hero-icons/PlusIcon"

interface TagBadgeProps {
  selected: boolean
  expenseId: number
  tagId: string
  tagName: string
  actionToHappen: () => void
}

export const SimpleTagBadge: React.FC<TagBadgeProps> = ({
  selected,
  expenseId,
  tagId,
  tagName,
  actionToHappen,
}) => {
  const router = useRouter()

  return (
    <Badge
      variant={selected ? "default" : "secondary"}
      className="mr-2 mb-2 rounded-full cursor-pointer"
      key={tagId}
      onClick={actionToHappen}
    >
      {tagName}
      <div className="ml-2 p-1">{selected ? <TrashIcon /> : <PlusIcon />}</div>
    </Badge>
  )
}
