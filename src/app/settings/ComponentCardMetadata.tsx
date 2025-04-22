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
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 flex flex-col items-center min-w-[220px] max-w-xs">
      <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        User Metadata
      </h2>
      <div className="w-full mb-4">
        <label className="block text-slate-400 text-sm mb-1 flex items-center gap-1" htmlFor="currency-select">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/><path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z"/></svg>
          Default Currency
        </label>
        <Select onValueChange={(value) => setDefaultCurrency(value)}>
          <SelectTrigger id="currency-select" className="w-full bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-400">
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
      </div>
      <div className="w-full">
        <label className="block text-slate-400 text-sm mb-1 flex items-center gap-1" htmlFor="frequency-select">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          Default Frequency
        </label>
        <Select onValueChange={(value) => setDefaultFrequency(value)}>
          <SelectTrigger id="frequency-select" className="w-full bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-400">
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
    </div>
  )
}

export default ComponentCardMetadata
