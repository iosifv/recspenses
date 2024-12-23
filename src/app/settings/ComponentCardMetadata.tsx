"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { CURRENCIES, FREQUENCIES } from "~/types/CustomEnum"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

interface ComponentCardMetadataProps {
  user: any
}

const ComponentCardMetadata: React.FC<ComponentCardMetadataProps> = ({ user }) => {
  const router = useRouter()

  const setDefaultCurrency = (value: string) => {
    fetch("/api/user/metadata", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "currency", value: value }),
    })
    router.refresh()
  }
  const setDefaultFrequency = (value: string) => {
    fetch("/api/user/metadata", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "frequency", value: value }),
    })
    router.refresh()
  }

  return (
    <div>
      <Select onValueChange={(value) => setDefaultCurrency(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={user.metadata.currency} />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((currency) => (
            <SelectItem value={currency} key={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => setDefaultFrequency(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={user.metadata.frequency} />
        </SelectTrigger>
        <SelectContent>
          {FREQUENCIES.map((frequency) => (
            <SelectItem value={frequency} key={frequency}>
              {frequency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ComponentCardMetadata
