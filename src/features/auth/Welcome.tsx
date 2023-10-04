import { Link } from "react-router-dom"
import { UserCog, UserPlus, FilePlus, ListTodo } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import useAuth from "../../hooks/useAuth"

const Welcome = () => {
  const date = new Date()

  const { isAdmin, isManager, username } = useAuth()

  const formattedDate = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date)

  return (
    <section className="mt-8">
      <p>{formattedDate}</p>

      <h1 className="text-3xl lg:text-4xl mt-8 text-blue-400">
        Welcome {username}
      </h1>

      <div className="grid grid-cols-2 lg:w-1/2 lg:mx-auto mt-8 gap-3">
        {isAdmin || isManager ? (
          <>
            <Link
              to="/dash/users/new"
              className={`${buttonVariants({
                variant: "outline",
              })} flex flex-col h-28 gap-4`}
            >
              <UserPlus size="30" />
              <p>Create New User</p>
            </Link>

            <Link
              to="/dash/users"
              className={`${buttonVariants({
                variant: "outline",
              })} flex flex-col h-28 gap-4`}
            >
              <UserCog size="30" />
              <p>Configure Users</p>
            </Link>
          </>
        ) : null}

        <Link
          to="/dash/notes/new"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <FilePlus size="30" />
          <p>Create New Note</p>
        </Link>

        <Link
          to="/dash/notes"
          className={`${buttonVariants({
            variant: "outline",
          })} flex flex-col h-28 gap-4`}
        >
          <ListTodo size="30" />
          <p>View Notes List</p>
        </Link>
      </div>
    </section>
  )
}
export default Welcome
