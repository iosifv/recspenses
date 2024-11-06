"use client"
import { useState, useEffect } from "react"
import { api } from "~/trpc/react"
import { toast } from "sonner"

export function ExpenseForm() {
  const [mounted, setMounted] = useState(false)
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createExpense.mutate({
      expense: JSON.stringify(formData),
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4 w-full">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="px-4 py-2 text-black rounded w-full"
        />
      </div>
      <div>
        <select
          name="currency"
          value={formData.currency || "GBP"}
          onChange={handleInputChange}
          className="px-4 py-2 text-black rounded w-full"
        >
          <option value="GBP">GBP</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="RON">RON</option>
        </select>
      </div>
      <div>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          min="0"
          step="1"
          className="px-4 py-2 text-black rounded w-full"
        />
      </div>
      <div>
        <select
          name="frequency"
          value={formData.frequency || "monthly"}
          onChange={handleInputChange}
          className="px-4 py-2 text-black rounded w-full"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          disabled={createExpense.isPending}
          className="px-6 py-2 bg-blue-500 rounded text-white cursor-pointer disabled:opacity-50"
        >
          <AddSvg />
        </button>
      </div>
    </form>
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
