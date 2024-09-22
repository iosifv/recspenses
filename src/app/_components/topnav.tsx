import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton  } from "@clerk/nextjs";
import Link from "next/link";
import { titleEnv } from "./titleEnv";



export function TopNav() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-slate-800">
      <div className="flex items-center flex-shrink-0 text-white mr-6 ml-6">
        <span className="font-semibold text-xl tracking-tight">Recspenses</span>
        <span className="font-semibold text-xs tracking-tight ml-2 text-yellow-400">{titleEnv()}</span>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto p-4">
          <SignedOut>
          <div className="text-l lg:flex-grow p-6">
          <Link className="mr-3 text-gray-300 hover:text-white" href="/">Home</Link>
          
        </div>
            <SignInButton/>
          </SignedOut>
          <SignedIn>
          <div className="text-l lg:flex-grow p-6">
          <Link className="mr-3 text-gray-300 hover:text-white" href="/">Home</Link>
          <Link className="mr-3 text-gray-300 hover:text-white" href="/dashboard">Dashboard</Link>
          <Link className="mr-3 text-gray-300 hover:text-white" href="/editor">Editor</Link>
        </div>
            <UserButton />
          </SignedIn>
      </div>
      </nav>
  );
}