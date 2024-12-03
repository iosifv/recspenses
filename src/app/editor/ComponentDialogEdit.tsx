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
  DialogClose,
  DialogFooter,
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
  const [name, setName] = useState(row.name)
  const [amount, setAmount] = useState(row.amount)
  const [currency, setCurrency] = useState(row.currency)
  const [frequency, setFrequency] = useState(row.frequency)
  const router = useRouter()

  const onSaveButtonClick = async () => {
    const editedExpense = {
      id: row.id,
      name: name,
      amount: amount,
      currency: currency,
      frequency: frequency,
      // tags: row.tags,
    }
    console.log(row.tags)

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

  const onDeleteButtonClick = async () => {
    const response = await fetch(`/api/expense/${row.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const json = await response.json()

    if (response.status === 400) {
      toast.error("Failed to delete Expense.", {
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
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Select onValueChange={(value) => setCurrency(value)}>
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
            <Select onValueChange={(value) => setFrequency(value)}>
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
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={onSaveButtonClick}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ComponentDialogEdit
