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
    console.log("tagType", tagType)

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
      className="w-64 h-64 bg-slate-50 shadow-lg rounded-xl bg-gray-800 text-white"
    >
      <CardHeader>
        <CardTitle>New Tag Type</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          id="new-tag-type"
          placeholder="Create New Tag Type"
          onChange={(e) => setTagType(e.target.value)}
          value={tagType}
        />
        <Button onClick={onNewTagTypeButtonClick}>Create</Button>
        <br />
      </CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )
}

export default NewTagTypeCard
