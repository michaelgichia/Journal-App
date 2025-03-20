import { auth } from '@/config/auth'

export default async function Page() {
  const session = await auth()
  console.log({ session })
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">
        Dashboard
      </h1>
    </main>
  )
}
