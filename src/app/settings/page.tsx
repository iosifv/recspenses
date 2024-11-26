import { api, HydrateClient } from "~/trpc/server"
import { getUser } from "~/server/controller/clerkController"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"
import { Input } from "~/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import { Tag, TagType } from "~/types/recspensesTypes"
import { Button } from "~/components/ui/button"
import NewTagTypeCard from "./NewTagTypeCard"
import ExistingTagTypeCard from "./ExistingTagTypeCard"
import UserInformationHoverCard from "./UserInformationHoverCard"

export default async function Settings() {
  const recspensesUser = await api.user.getMe()
  const clerkUser = await getUser()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col  bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">Settings</h1>
          {recspensesUser && clerkUser && (
            <UserInformationHoverCard recspensesUser={recspensesUser} clerkUser={clerkUser} />
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {recspensesUser.tagTypes.map((tagType: TagType) => (
              <ExistingTagTypeCard key={tagType.id} tagType={tagType} tags={recspensesUser.tags} />
            ))}
            <NewTagTypeCard />
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
