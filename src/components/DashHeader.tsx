import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"

const DashHeader = () => {
  const location = useLocation()

  const newUserButton =
    location.pathname === "/dash/users" ? (
      <Button variant="ghost">
        <Link to="/dash/users/new">Create New User</Link>
      </Button>
    ) : null

  return (
    <header className="pb-4 border-b flex justify-between items-center">
      <Link to="/dash">
        <h1 className="text-5xl">techNotes</h1>
      </Link>
      <nav className="flex items-center">
        {newUserButton}
        <ModeToggle />
      </nav>
    </header>
  )
}
export default DashHeader
