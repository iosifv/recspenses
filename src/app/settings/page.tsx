import { api, HydrateClient } from "~/trpc/server"
import { getUser } from "~/server/controller/clerkController"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import { Tag, TagType } from "~/types/recspensesTypes"

function mergeTagTypesAndTags(tagTypes: TagType[], tags: Tag[]) {
  const tagTypesMap = new Map(tagTypes.map((tagType) => [tagType.id, tagType]))
  const tagsMap = new Map(tags.map((tag) => [tag.id, tag]))
  const mergedTags = Array.from(tagsMap.values()).map((tag) => {
    const tagType = tagTypesMap.get(tag.type)
    if (!tagType) {
      throw new Error("Tag type not found")
    }
    return {
      tagType: tagType.name,
      tagTypeColor: tagType.color,
      tag: tag.name,
      tagColor: tag.color,
    }
  })

  return mergedTags
}

export default async function Settings() {
  const recspensesUser = await api.user.getMe()
  const clerkUser = await getUser()
  const tagTableData = mergeTagTypesAndTags(recspensesUser.tagTypes, recspensesUser.tags)

  // console.log(recspensesUser)
  // console.log(clerkUser)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col  bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Settings</h1>
          {recspensesUser && clerkUser && (
            <HoverCard>
              <HoverCardTrigger>
                <img src={clerkUser.imageUrl} alt="Profile" className="h-24 w-24 rounded-full" />
                Hover for user information
              </HoverCardTrigger>
              <HoverCardContent className="w-120 bg-black text-white">
                <div className="text-m">
                  <p>User ID: {recspensesUser.userId}</p>
                  <p>
                    Name: {clerkUser.firstName} {clerkUser.lastName}
                  </p>
                  <p>Email: {clerkUser.emailAddresses[0]?.emailAddress}</p>
                  <p>
                    Created:{" "}
                    {recspensesUser.createdAt
                      ? new Date(recspensesUser.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    Updated:{" "}
                    {recspensesUser.updatedAt
                      ? new Date(recspensesUser.updatedAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    Seen At:{" "}
                    {recspensesUser.seenAt
                      ? new Date(recspensesUser.seenAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
          {/* <div className="container mx-auto py-10">
            <DataTable columns={columns} data={tagTableData} />
          </div> */}
          <div className="flex flex-wrap justify-center gap-4">
            {recspensesUser.tagTypes.map((tagType: TagType) => (
              <Card
                key={tagType.id}
                className="w-64 h-64 bg-slate-50 shadow-lg rounded-xl bg-black text-white"
              >
                <CardHeader>
                  <CardTitle>{tagType.name}</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    {recspensesUser.tags
                      .filter((tag: Tag) => tag.type === tagType.id)
                      .map((tag: Tag) => (
                        <li key={tag.id}>{tag.name}</li>
                      ))}
                  </ul>
                </CardContent>
                <CardFooter>
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
                </CardFooter>
              </Card>
            ))}
          </div>
          <br />
          <div className="flex justify-between">
            <div className="flex-1 text-center">
              <pre className="text-left">{JSON.stringify(recspensesUser.tagTypes, null, 2)}</pre>
            </div>
            <div className="flex-1 text-center">
              <pre className="text-left">{JSON.stringify(recspensesUser.tags, null, 2)}</pre>
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
