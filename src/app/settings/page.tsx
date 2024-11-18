import { api, HydrateClient } from "~/trpc/server"
import { getUser } from "~/server/controller/clerkController"

export default async function Settings() {
  const recspensesUser = await api.user.getMe()
  const clerkUser = await getUser()

  // console.log(recspensesUser)
  // console.log(clerkUser)

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">Settings</h1>

          {recspensesUser && clerkUser && (
            <div className="flex flex-col items-center gap-4">
              <img src={clerkUser.imageUrl} alt="Profile" className="h-24 w-24 rounded-full" />
              <div className="text-xl">
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
                  {recspensesUser.seenAt ? new Date(recspensesUser.seenAt).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </HydrateClient>
  )
}
