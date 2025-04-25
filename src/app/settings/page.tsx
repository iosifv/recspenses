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
  const plainRecspensesUser = recspensesUser.toPlainObject()

  // console.dir(plainRecspensesUser.tagTypes, { depth: null })
  // console.dir(plainRecspensesUser.tags, { depth: null })

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col  bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <section className="w-full max-w-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl rounded-2xl p-8 mb-8 flex flex-col items-center border border-slate-700">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem] bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg mb-2 text-center">
              Settings
            </h1>
            <p className="text-lg text-slate-300 mb-6 text-center font-medium">
              Manage your account, metadata, and tag types
            </p>
            <div className="w-full flex flex-col md:flex-row gap-6 justify-center items-stretch">
              {recspensesUser && clerkUser && (
                <div className="flex-1 min-w-[220px] flex items-center justify-center">
                  <UserInformationHoverCard recspensesUser={recspensesUser} clerkUser={clerkUser} />
                </div>
              )}
              <div className="flex-1 min-w-[220px] flex items-center justify-center">
                <ComponentCardMetadata user={plainRecspensesUser} />
              </div>
            </div>
          </section>
          <section className="w-full max-w-5xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl rounded-2xl p-8 mt-8 flex flex-col items-center border border-slate-700">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 mb-2 text-center">
              Tag Types
            </h2>
            <p className="text-base text-slate-300 mb-6 text-center">
              Organize your tags by type. Add, edit, or delete tag types and tags below.
            </p>
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {plainRecspensesUser.tagTypes.map((tagType: TagType) => (
                <ExistingTagTypeCard
                  key={tagType.id}
                  tagType={tagType}
                  tags={plainRecspensesUser.tags}
                />
              ))}
              <NewTagTypeCard />
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  )
}
