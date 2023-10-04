import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { useGetUsersQuery } from "./usersApiSlice"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import User from "./User"

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const customError = error as FetchBaseQueryError & {
    data: {
      message: string
    }
  }

  let content: JSX.Element | null = null

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = (
      <p
        className={
          customError
            ? "text-red-600 font-bold mb-4 text-center"
            : "absolute left-[-9999px]"
        }
      >
        {customError.data?.message}
      </p>
    )
  }

  if (isSuccess) {
    const { ids } = users

    const usersContent = ids.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null

    content = (
      <Table className="mt-8 lg:w-3/4 mx-auto">
        <TableHeader>
          <TableRow className="lg:text-lg">
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="w-1/2 text-center">Roles</TableHead>
            <TableHead className="text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{usersContent}</TableBody>
      </Table>
    )
  }

  return content
}
export default UsersList
