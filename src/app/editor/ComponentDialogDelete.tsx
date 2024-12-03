"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import TrashIcon from "~/components/hero-icons/TrashIcon"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

interface ExistingTagTypeCardProps {
  row: any
}

const ComponentDialogDelete: React.FC<ExistingTagTypeCardProps> = ({ row }) => {
  const router = useRouter()

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TrashIcon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete the expense <b>{row.name}</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteButtonClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ComponentDialogDelete
