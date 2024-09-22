import { api, HydrateClient } from "~/trpc/server"

export default async function Dashboard() {
  const mine = await api.expense.getMine()
  console.log(mine)

  void api.expense.getMine.prefetch()

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">dashboard</h1>

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
