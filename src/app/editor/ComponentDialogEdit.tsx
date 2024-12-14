"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { CURRENCIES, FREQUENCIES } from "~/server/db/schema"

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
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
import { SimpleTagBadge } from "~/components/custom/SimpleTagBadge"
import { on } from "events"

interface ExistingTagTypeCardProps {
  row: any
  user: any
}

const ComponentDialogEdit: React.FC<ExistingTagTypeCardProps> = ({ row, user }) => {
  const [name, setName] = useState(row.name)
  const [amount, setAmount] = useState(row.amount)
  const [currency, setCurrency] = useState(row.currency)
  const [frequency, setFrequency] = useState(row.frequency)
  const [currentTagIds, setCurrentTagIds] = useState(row.tags.map((tag: any) => tag.id))
  const router = useRouter()

  let existingTags = user.tags.filter((tag: any) => currentTagIds.includes(tag.id))
  let remainingTags = user.tags.filter((tag: any) => !currentTagIds.includes(tag.id))

  const onAddTagButtonClick = async (tagId: string) => {
    console.log("onAddTagButtonClick", tagId)
    setCurrentTagIds((prev: any) => [...prev, tagId])
    router.refresh()
  }

  const onRemoveTagButtonClick = (tagId: string) => {
    console.log("removeTagButtonClick", tagId)
    setCurrentTagIds((prev: any) => prev.filter((id: any) => id !== tagId))
    router.refresh()
  }

  const onSaveButtonClick = async () => {
    const editedExpense = {
      // id: row.id,
      name: name,
      amount: amount,
      currency: currency,
      frequency: frequency,
      tags: currentTagIds,
    }

    console.log("editedExpense", editedExpense)

    const response = await fetch(`/api/expense/${row.id}`, {
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
          <hr className="border-slate-500 border-1 w-full" />
          <DialogDescription>
            <div className="flex justify-between">
              {existingTags.map((tag: any) => (
                <SimpleTagBadge
                  selected={true}
                  expenseId={row.id}
                  tagId={tag.id}
                  tagName={tag.name}
                  key={tag.id}
                  actionToHappen={() => onRemoveTagButtonClick(tag.id)}
                />
              ))}
            </div>

            <div className="flex justify-between">
              {remainingTags.map((tag: any) => (
                <SimpleTagBadge
                  selected={false}
                  expenseId={row.id}
                  tagId={tag.id}
                  tagName={tag.name}
                  key={tag.id}
                  actionToHappen={() => onAddTagButtonClick(tag.id)}
                />
              ))}
            </div>
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
