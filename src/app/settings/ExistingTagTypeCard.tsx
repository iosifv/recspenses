import React from "react"
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
              <li key={tag.id}>{tag.name}</li>
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
        <Input type="text" id="new-tag" placeholder="New Tag" />
        <Button>Add</Button>
      </CardFooter>
    </Card>
  )
}

export default ExistingTagTypeCard
