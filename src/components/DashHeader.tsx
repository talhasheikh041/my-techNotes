import { Link } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import { useEffect } from "react"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import Loading from "./Loading"
import { useToast } from "./ui/use-toast"
import { isErrorWithMessage, isFetchBaseQueryError } from "../lib/utils"

const DashHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess, navigate])

  useEffect(() => {
    if (
      isError &&
      isFetchBaseQueryError(error) &&
      isErrorWithMessage(error.data)
    )
      toast({
        title: "Error: Cannot Logout",
        description: error.data.message,
      })
  }, [isError])

  let logoutButton = (
    <Button variant="outline" size="icon" title="Logout" onClick={sendLogout}>
      <LogOut />
    </Button>
  )

  if (isLoading) logoutButton = <Loading />

  return (
    <header className="pb-4 border-b flex justify-between items-center">
      <Link to="/dash">
        <h1 className="text-5xl">techNotes</h1>
      </Link>
      <nav className="flex items-center gap-1">
        {logoutButton}
        <ModeToggle />
      </nav>
    </header>
  )
}
export default DashHeader
