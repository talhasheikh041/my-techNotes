import { Home } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "./ui/button"

const DashFooter = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

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
      <p>Current User: </p>
      <p>Status</p>
    </footer>
  )
}
export default DashFooter
