import { api, HydrateClient } from "~/trpc/server"
import { getUser } from "~/server/controller/clerkController"

import NewTagTypeCard from "./ComponentCardTagTypeNew"
import ExistingTagTypeCard from "./ComponentCardTagTypeExisting"
import UserInformationHoverCard from "./ComponentHoverUserInfo"
import { TagType } from "~/types/TagType"
import ComponentCardMetadata from "./ComponentCardMetadata"

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
          <ComponentCardMetadata user={recspensesUser} />
          <hr className="border-slate-500 border-1 w-full" />
          <div className="flex flex-wrap justify-center gap-4">
            {recspensesUser.tagTypes.map((tagType: TagType) => (
              <ExistingTagTypeCard key={tagType.id} tagType={tagType} tags={recspensesUser.tags} />
            ))}
            <NewTagTypeCard />
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
