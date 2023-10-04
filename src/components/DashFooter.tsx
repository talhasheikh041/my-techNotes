import { Home } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import useAuth from "../hooks/useAuth"

const DashFooter = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { status, username } = useAuth()

  const goHomeButton =
    pathname !== "/dash" ? (
      <Button
        variant="link"
        title="Home"
        className="hover:scale-150 transition-all duration-150"
        onClick={() => navigate("/dash")}
      >
        <Home size="30px" />
      </Button>
    ) : null

  return (
    <footer className="mt-auto flex gap-5 items-center border-t pt-4">
      {goHomeButton}
      <p>Current User: {username}</p>
      <p>Status: {status}</p>
    </footer>
  )
}
export default DashFooter
