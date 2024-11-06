"use client"
import { useState } from "react"
import { api } from "~/trpc/react"
import { toast } from "sonner"

export function ExpenseForm() {
  const [formData, setFormData] = useState({
    name: "",
    currency: "",
    amount: "",
    frequency: "",
  })

  const utils = api.useUtils()
  const createExpense = api.expense.createMine.useMutation({
    onSuccess: () => {
      toast.success("Expense created successfully!")
      setFormData({ name: "", currency: "", amount: "", frequency: "" })
      utils.expense.getMine.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createExpense.mutate({
      expense: JSON.stringify(formData)
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="px-4 py-2 text-black rounded"
        />
        <input
          type="text"
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          placeholder="Currency"
          className="px-4 py-2 text-black rounded"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          className="px-4 py-2 text-black rounded"
        />
        <input
          type="text"
          name="frequency"
          value={formData.frequency}
          onChange={handleInputChange}
          placeholder="Frequency"
          className="px-4 py-2 text-black rounded"
        />
        <button
          type="submit"
          disabled={createExpense.isLoading}
          className="px-6 py-2 bg-blue-500 rounded text-white cursor-pointer disabled:opacity-50"
        >
          <AddSvg />
        </button>
      </form>
    </div>
  )
}

function AddSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  )
}
