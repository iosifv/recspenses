import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

// Force the page to be server-side rendered and bypass the vercel caching
export const dynamic = "force-dynamic";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Recspenses App
          </h1>
          <SignedOut>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Please sign in above to view the page.
            </p>
          </div>
          </SignedOut>
          <SignedIn>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
          </div>
          <LatestPost />
          </SignedIn>
         

          
        </div>
      </main>
    </HydrateClient>
  );
}
