// import { useState } from "react"
import { toast } from "sonner"
import { api, HydrateClient } from "~/trpc/server"

export default async function Dashboard() {
  const mine = await api.expense.getMine()
  console.log(mine)

  // State to store input data
  // const [formData, setFormData] = useState({
  //   userId: "",
  //   amount: "",
  // })

  // Handle input changes
  const handleInputChange = () => {
    // const { name, value } = e.target
    // setFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    // e.preventDefault()
    // try {
    //   // Call the API to create a new expense
    //   await api.expense.create(formData)
    //   // You can update the state or trigger a re-fetch of the "mine" data here
    //   alert("Expense created successfully!")
    // } catch (error) {
    //   console.error("Error creating expense:", error)
    // }
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

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">editor</h1>

          {/* Form for creating a new expense */}
          <div className="flex flex-col items-center gap-2">
            <form className="flex flex-col items-center gap-4">
              <input
                type="text"
                name="userId"
                // value={formData.userId}
                // onChange={handleInputChange}
                placeholder="User ID"
                className="px-4 py-2 text-black rounded"
              />
              <input
                type="text"
                name="amount"
                // value={formData.amount}
                // onChange={handleInputChange}
                placeholder="Amount"
                className="px-4 py-2 text-black rounded"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 rounded text-white cursor-pointer"
              >
                <AddSvg />
              </button>
            </form>
          </div>

          {/* Display the list of existing expenses */}

          <div className="flex flex-col items-center gap-2">
            {mine.map((item, index) => {
              return (
                <p className="text-2xl text-white" key={index}>
                  {item.userId}
                </p>
              )
            })}
          </div>
        </div>
      </main>
    </HydrateClient>
  )
}
