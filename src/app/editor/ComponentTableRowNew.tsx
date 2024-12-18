import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { CURRENCIES, FREQUENCIES } from "~/types/backend/CustomEnum"
import PlusIcon from "~/components/hero-icons/PlusIcon"

import { toast } from "sonner"
import { Input } from "~/components/ui/input"
import { TableCell, TableRow } from "~/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const ComponentTableRowNew = () => {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR" | "RON" | "">("")
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly" | "">("")
  const router = useRouter()

  const onAddButtonClick = async () => {
    const newExpense = {
      userId: "",
      name: name.trim(),
      amount: amount,
      currency: currency as "GBP" | "USD" | "EUR" | "RON",
      frequency: frequency as "daily" | "weekly" | "monthly" | "yearly",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      extra: {},
    }

    let validationError = false
    if (name.trim() === "") {
      toast.error("Expense name can not be empty")
      validationError = true
    }
    if (amount <= 0) {
      toast.error("Expense amount must be greater than 0")
      validationError = true
    }
    if (currency === "") {
      toast.error("Expense currency can not be empty")
      validationError = true
    }
    if (frequency === "") {
      toast.error("Expense frequency can not be empty")
      validationError = true
    }
    if (validationError) {
      return
    }

    const response = await fetch("/api/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expense: newExpense }),
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
    <TableRow>
      <TableCell></TableCell>
      <TableCell>
        <Input
          type="text"
          placeholder="Name of new expense"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Select
          onValueChange={(value: "" | "daily" | "weekly" | "monthly" | "yearly") =>
            setFrequency(value)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FREQUENCIES.map((frequency) => (
              <SelectItem value={frequency} key={frequency}>
                {frequency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell>
        <Select onValueChange={(value: "" | "GBP" | "USD" | "EUR" | "RON") => setCurrency(value)}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem value={currency} key={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          className="w-[80px]"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </TableCell>
      <TableCell>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <PlusIcon onClick={onAddButtonClick} />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default ComponentTableRowNew
