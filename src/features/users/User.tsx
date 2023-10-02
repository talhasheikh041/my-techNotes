import { useAppSelector } from "@/hooks/reduxHooks"
import { selectUserById } from "./usersApiSlice"
import { EntityId } from "@reduxjs/toolkit"
import { TableCell, TableRow } from "@/components/ui/table"

import EditUser from "./EditUser"

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
            <EditUser user={user} />
          </TableCell>
        </TableRow>
      </>
    )
  } else return null
}
export default User
