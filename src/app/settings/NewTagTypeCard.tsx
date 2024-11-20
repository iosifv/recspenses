import { api } from "~/trpc/server"
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

const NewTagTypeCard = () => {
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
        <Input type="text" id="new-tag-type" placeholder="Create New Tag Type" />
        <Button>Create</Button>
        <br />
      </CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )
}

export default NewTagTypeCard
