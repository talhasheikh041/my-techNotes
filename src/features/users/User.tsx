import { Link } from "react-router-dom"
import { PenSquare } from "lucide-react"

import { useAppSelector } from "@/hooks/reduxHooks"
import { selectUserById } from "./usersApiSlice"
import { buttonVariants } from "@/components/ui/button"
import { EntityId } from "@reduxjs/toolkit"
import { TableCell, TableRow } from "@/components/ui/table"

type UserProps = {
  userId: EntityId
}

const User = ({ userId }: UserProps) => {
  const user = useAppSelector((state) => selectUserById(state, userId))

  if (user) {
    const userRolesString = user.roles.toString().replace(",", ", ")

    return (
      <>
        <TableRow className="lg:text-base">
          <TableCell className="font-medium text-center">
            {user.username}
          </TableCell>
          <TableCell className="w-1/2 text-center">{userRolesString}</TableCell>
          <TableCell className="text-center">
            <Link
              className={buttonVariants({ variant: "link" })}
              to={`/dash/users/${userId}`}
            >
              <PenSquare
                className="hover:scale-150 transition-all duration-150"
                size="20px"
              />
            </Link>
          </TableCell>
        </TableRow>
      </>
    )
  } else return null
}
export default User
