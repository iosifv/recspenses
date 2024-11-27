import { ExpenseForm } from "./ComponentFormExpense"

interface Expense {
  name: string
  currency: string
  amount: string | number
  frequency: string
}

interface ExpenseTableProps {
  expenses: Expense[]
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-5 gap-4 w-full max-w-4xl text-xl font-bold">
        <div>Name</div>
        <div>Currency</div>
        <div>Amount</div>
        <div>Frequency</div>
        <div>Actions</div>
      </div>
      {expenses.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 w-full max-w-4xl">
          <div>{item.name}</div>
          <div>{item.currency}</div>
          <div>{item.amount}</div>
          <div>{item.frequency}</div>
        </div>
      ))}
      <ExpenseForm />
    </div>
  )
}
