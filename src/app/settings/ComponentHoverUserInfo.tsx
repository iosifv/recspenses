import React from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card"

interface UserInformationHoverCardProps {
  recspensesUser: any // Replace 'any' with the appropriate type
  clerkUser: any // Replace 'any' with the appropriate type
}

const UserInformationHoverCard: React.FC<UserInformationHoverCardProps> = ({
  recspensesUser,
  clerkUser,
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <img
          src={clerkUser.imageUrl}
          alt="Profile"
          className="h-28 w-28 rounded-full border-4 border-white shadow-lg ring-4 ring-sky-400 hover:ring-indigo-400 transition-all duration-200"
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-80 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-2xl p-6 border border-slate-700">
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-sky-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M6 21v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
            </svg>
            {clerkUser.firstName} {clerkUser.lastName}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M16 12a4 4 0 01-8 0V8a4 4 0 018 0v4z" />
              <path d="M12 16v2m0 0h.01M12 18a6 6 0 01-6-6V8a6 6 0 1112 0v4a6 6 0 01-6 6z" />
            </svg>
            {clerkUser.emailAddresses[0]?.emailAddress}
          </span>
          <span className="text-xs text-slate-500">User ID: {recspensesUser.userId}</span>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
            </svg>
            <span>
              Created:{" "}
              {recspensesUser.createdAt
                ? new Date(recspensesUser.createdAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-sky-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>
              Updated:{" "}
              {recspensesUser.updatedAt
                ? new Date(recspensesUser.updatedAt).toLocaleString()
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span>
              Seen At:{" "}
              {recspensesUser.seenAt ? new Date(recspensesUser.seenAt).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserInformationHoverCard
