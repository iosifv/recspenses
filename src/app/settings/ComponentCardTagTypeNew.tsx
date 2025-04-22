"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
// type Props = { addTagTypeComponent: (tagType: string) => void }

const NewTagTypeCard = () => {
  const [tagType, setTagType] = useState("")
  const router = useRouter()

  const onNewTagTypeButtonClick = () => {
    fetch("/api/user/tagType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagType }),
    })
    router.refresh()
  }

  return (
    <Card
      key="new-tag-type"
      className="w-72 min-h-[340px] bg-gradient-to-br from-slate-800 to-gray-900 shadow-2xl rounded-2xl border border-slate-700 text-white flex flex-col justify-between"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          + New Tag Type
        </CardTitle>
        <CardDescription className="text-slate-300 mt-1 mb-2 text-sm">
          Create a new tag type to organize your expenses.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 mb-2">
        <Input
          type="text"
          id="new-tag-type"
          placeholder="Tag Type Name"
          className="rounded-lg bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-emerald-400 text-white"
          onChange={(e) => setTagType(e.target.value)}
          value={tagType}
        />
        <Button
          onClick={onNewTagTypeButtonClick}
          className="bg-emerald-500 hover:bg-emerald-600 rounded-lg px-3 py-2 mt-1"
        >
          Create
        </Button>
      </CardContent>
    </Card>
  )
}

export default NewTagTypeCard
