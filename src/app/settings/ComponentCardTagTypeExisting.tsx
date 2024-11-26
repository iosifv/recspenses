"use client"

import React, { useState } from "react"
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
import { Tag, TagType } from "~/types/recspensesTypes"

interface ExistingTagTypeCardProps {
  tagType: TagType
  tags: Tag[]
}

const ExistingTagTypeCard: React.FC<ExistingTagTypeCardProps> = ({ tagType, tags }) => {
  const [tag, setTag] = useState("")

  const onAddTagTypeButtonClick = () => {
    fetch("/api/user/tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagType: tagType.id, tag: tag }),
    })
  }

  const onDeleteTagButtonClick = (tagId: string) => () => {
    fetch("/api/user/tag", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagId: tagId }),
    })
  }

  return (
    <Card className="w-64 h-64 bg-slate-50 shadow-lg rounded-xl bg-gray-900 text-white">
      <CardHeader>
        <CardTitle>{tagType.name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside">
          {tags
            .filter((tag: Tag) => tag.type === tagType.id)
            .map((tag: Tag) => (
              <li key={tag.id}>
                {tag.name} <Button onClick={onDeleteTagButtonClick(tag.id)}>❌</Button>
              </li>
            ))}
        </ul>{" "}
        Colour:
        <div
          style={{
            marginLeft: "10px",
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            backgroundColor: tagType.color,
          }}
        ></div>
      </CardContent>
      <CardFooter>
        <Input
          type="text"
          id="new-tag"
          placeholder="New Tag"
          onChange={(e) => setTag(e.target.value)}
          value={tag}
        />
        <Button onClick={onAddTagTypeButtonClick}>Add</Button>
      </CardFooter>
    </Card>
  )
}

export default ExistingTagTypeCard
