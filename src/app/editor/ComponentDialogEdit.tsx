"use client"

import React, { useState } from "react"
import { CURRENCIES, FREQUENCIES } from "~/server/db/schema"

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import EditIcon from "~/components/hero-icons/EditIcon"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

interface ExistingTagTypeCardProps {
  row: any
}

const ComponentDialogEdit: React.FC<ExistingTagTypeCardProps> = ({ row }) => {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const router = useRouter()

  const onSaveButtonClick = async () => {
    const editedExpense = {
      id: row.id,
      name: name,
      amount: amount,
      currency: row.currency,
      frequency: row.frequency,
      tags: row.tags,
    }

    const response = await fetch("/api/expense", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expense: editedExpense }),
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to edit Expense.", {
        description: json.error,
      })
      return
    }

    router.refresh()
  }

  return (
    <Dialog>
      <DialogTrigger>
        <EditIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{row.name}</DialogTitle>
          <DialogDescription>
            <Input
              type="text"
              placeholder={row.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Input>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={row.currency} />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem value={currency} key={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={row.frequency} />
              </SelectTrigger>
              <SelectContent>
                {FREQUENCIES.map((frequency) => (
                  <SelectItem value={frequency} key={frequency}>
                    {frequency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder={row.amount}
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            ></Input>
            <Button>Cancel</Button>
            <Button onClick={onSaveButtonClick}>Save</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ComponentDialogEdit
