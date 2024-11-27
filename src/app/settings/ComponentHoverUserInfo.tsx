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
        <img src={clerkUser.imageUrl} alt="Profile" className="h-24 w-24 rounded-full" />
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
            {recspensesUser.createdAt ? new Date(recspensesUser.createdAt).toLocaleString() : "N/A"}
          </p>
          <p>
            Updated:{" "}
            {recspensesUser.updatedAt ? new Date(recspensesUser.updatedAt).toLocaleString() : "N/A"}
          </p>
          <p>
            Seen At:{" "}
            {recspensesUser.seenAt ? new Date(recspensesUser.seenAt).toLocaleString() : "N/A"}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default UserInformationHoverCard
