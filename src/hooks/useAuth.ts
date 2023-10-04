import { useAppSelector } from "./reduxHooks"
import jwtDecode from "jwt-decode"
import { selectCurrentToken } from "../features/auth/authSlice"

type DecodedTokenType = {
  UserInfo: {
    username: string
    roles: string[]
  }
}

const useAuth = () => {
  const token = useAppSelector(selectCurrentToken)
  let status = ""
  let isAdmin = false
  let isManager = false

  if (token) {
    const decodedToken: DecodedTokenType = jwtDecode(token)

    const { username, roles } = decodedToken.UserInfo

    isManager = roles.includes("Manager")
    isAdmin = roles.includes("Admin")

    if (isManager) status = "Manager"
    if (isAdmin) status = "Admin"

    return { username, roles, status, isManager, isAdmin }
  }

  return { username: "", roles: [], isManager, isAdmin, status }
}
export default useAuth
