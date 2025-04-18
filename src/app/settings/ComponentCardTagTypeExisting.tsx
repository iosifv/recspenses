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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TrashIcon from "~/components/hero-icons/TrashIcon"
import PlusIcon from "~/components/hero-icons/PlusIcon"
import { Tag } from "~/types/Tag"
import { TagType } from "~/types/TagType"
import { SettingTagBadge } from "~/components/custom/SettingTagBadge"

interface ExistingTagTypeCardProps {
  tagType: TagType
  tags: Tag[]
}

const ExistingTagTypeCard: React.FC<ExistingTagTypeCardProps> = ({ tagType, tags }) => {
  const [tag, setTag] = useState("")
  const router = useRouter()

  const onAddTagTypeButtonClick = async () => {
    const response = await fetch("/api/user/tag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagType: tagType.id, tag: tag }),
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to add Tag.", {
        description: json.error,
      })
      return
    }

    router.refresh()
  }

  console.log(tagType)
  console.log(tags)

  // const onDeleteTagButtonClick = (tagId: string) => async () => {
  //   await fetch("/api/user/tag", {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ tagId: tagId }),
  //   })
  //   router.refresh()
  // }

  const onDeleteTagTypeButtonClick = (tagTypeId: string) => async () => {
    const response = await fetch("/api/user/tagType", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagTypeId: tagTypeId }),
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to delete TagType.", {
        description: json.error,
      })
      return
    }

    router.refresh()
  }

  // console.log(tagType)
  // console.log(tags.filter((tag: Tag) => tag.type.id === tagType.id))

  return (
    <Card className="w-64 bg-slate-50 shadow-lg rounded-xl bg-gray-900 text-white">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{tagType.name}</CardTitle>
            <div
              style={{
                marginLeft: "0px",
                width: "125px",
                height: "8px",
                borderRadius: "3px",
                backgroundColor: tagType.color,
              }}
            ></div>
            <CardDescription>{tagType.description}</CardDescription>
          </div>

          <div className="ml-2 p-0 cursor-pointer" onClick={onDeleteTagTypeButtonClick(tagType.id)}>
            <TrashIcon />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tags
          .filter((tag: Tag) => tag.type === tagType.id)
          .map((tag: Tag) => (
            <SettingTagBadge key={tag.id} id={tag.id} name={tag.name} />
          ))}
      </CardContent>
      <CardFooter>
        <Input
          type="text"
          id="new-tag"
          placeholder="New Tag"
          onChange={(e) => setTag(e.target.value)}
          value={tag}
        />
        <Button onClick={onAddTagTypeButtonClick}>
          <PlusIcon />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ExistingTagTypeCard
