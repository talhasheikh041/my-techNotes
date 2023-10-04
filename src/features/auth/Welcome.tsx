import { Link } from "react-router-dom"
import { Pencil, User, View } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

const Welcome = () => {
  const date = new Date()

  const formattedDate = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date)

  return (
    <section className="mt-8">
      <p>{formattedDate}</p>

      <h1 className="text-4xl mt-6">Welcome</h1>

      <div className="grid grid-cols-2 lg:w-1/2 lg:mx-auto mt-8 gap-3">
        <Link
          to="/dash/users/new"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <User size="30" />
          <p>Create New User</p>
        </Link>

        <Link
          to="/dash/users"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <View size="30" />
          <p>View Users List</p>
        </Link>

        <Link
          to="/dash/notes/new"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <Pencil size="30" />
          <p>Create New Note</p>
        </Link>

        <Link
          to="/dash/notes"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <View size="30" />
          <p>View Notes List</p>
        </Link>
      </div>
    </section>
  )
}
export default Welcome
