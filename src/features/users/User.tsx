import { useGetUsersQuery } from "./usersApiSlice"
import { EntityId } from "@reduxjs/toolkit"
import { TableCell, TableRow } from "@/components/ui/table"
import { memo } from "react"

import EditUser from "./EditUser"

type UserProps = {
  userId: EntityId
}

const User = ({ userId }: UserProps) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  })

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

const memoizedUser = memo(User)

export default memoizedUser
