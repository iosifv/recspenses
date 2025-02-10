import "~/styles/globals.css"

import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { TopNav } from "./ComponentTopNav"

import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"

import { TRPCReactProvider } from "~/trpc/react"
import { titleEnv } from "../lib/titleEnv"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Recspenses App | " + titleEnv(),
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TopNav />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
