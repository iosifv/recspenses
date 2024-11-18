import { SignedIn, SignedOut } from "@clerk/nextjs"
import { touchUser } from "~/server/controller/clerkController"

import { api, HydrateClient } from "~/trpc/server"

// Force the page to be server-side rendered and bypass the vercel caching
export const dynamic = "force-dynamic"

async function TouchUserComponent() {
  await touchUser()
  return null
}

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">Recspenses App</h1>
          <SignedOut>
            <div className="flex flex-col items-center gap-2">
              <p className="text-2xl text-white">Please sign in above to view the page.</p>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col items-center gap-2">
              <TouchUserComponent />
              <p className="text-2xl text-white">Fancy description goes here</p>
            </div>
          </SignedIn>
        </div>
      </main>
    </HydrateClient>
  )
}
