import { Link } from "react-router-dom"
import { ArrowBigRightDashIcon } from "lucide-react"

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
      <p className="mt-8">
        <Link className="flex gap-2" to="/dash/notes">
          <ArrowBigRightDashIcon />
          <span>View techNotes</span>
        </Link>
      </p>
      <p className="mt-1">
        <Link className="flex gap-2" to="/dash/users">
          <ArrowBigRightDashIcon />
          <span>View User Settings</span>
        </Link>
      </p>
    </section>
  )
}
export default Welcome
