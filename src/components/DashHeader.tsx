import { Link } from "react-router-dom"
import { useLocation, useNavigate } from "react-router-dom"
import { FilePlus, ListTodo, LogOut, UserCog, UserPlus } from "lucide-react"
import { Button } from "./ui/button"
import { ModeToggle } from "./mode-toggle"
import { useEffect } from "react"
import { useSendLogoutMutation } from "../features/auth/authApiSlice"
import Loading from "./Loading"
import { useToast } from "./ui/use-toast"
import { isErrorWithMessage, isFetchBaseQueryError } from "../lib/utils"
import useAuth from "../hooks/useAuth"

const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { isAdmin, isManager } = useAuth()

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

  const onNewNoteClicked = () => navigate("/dash/notes/new")
  const onNewUserClicked = () => navigate("/dash/users/new")
  const onNotesClicked = () => navigate("/dash/notes")
  const onUsersClicked = () => navigate("/dash/users")

  let newNoteButton = null
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <Button
        variant="outline"
        size="icon"
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <FilePlus />
      </Button>
    )
  }

  let newUserButton = null
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <Button
        variant="outline"
        size="icon"
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <UserPlus />
      </Button>
    )
  }

  let userButton = null
  if (isManager || isAdmin) {
    if (
      !USERS_REGEX.test(pathname) &&
      pathname.includes("/dash") &&
      !DASH_REGEX.test(pathname)
    ) {
      userButton = (
        <Button
          variant="outline"
          size="icon"
          className="icon-button"
          title="Users"
          onClick={onUsersClicked}
        >
          <UserCog />
        </Button>
      )
    }
  }

  let notesButton = null
  if (
    !NOTES_REGEX.test(pathname) &&
    pathname.includes("/dash") &&
    !DASH_REGEX.test(pathname)
  ) {
    notesButton = (
      <Button
        variant="outline"
        size="icon"
        className="icon-button"
        title="Notes"
        onClick={onNotesClicked}
      >
        <ListTodo />
      </Button>
    )
  }

  let logoutButton = (
    <Button variant="outline" size="icon" title="Logout" onClick={sendLogout}>
      <LogOut />
    </Button>
  )

  if (isLoading) logoutButton = <Loading />

  const navButtons = (
    <>
      {newNoteButton}
      {newUserButton}
      {notesButton}
      {userButton}
      {logoutButton}
    </>
  )

  return (
    <header className="pb-4 border-b lg:flex lg:flex-row lg:justify-between lg:items-center flex flex-col items-center gap-6">
      <Link to="/dash">
        <h1 className="text-4xl lg:text-5xl font-bold">techNotes</h1>
      </Link>
      <nav className="flex items-center gap-1">
        {navButtons}
        <ModeToggle />
      </nav>
    </header>
  )
}
export default DashHeader
