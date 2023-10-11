import { useGetUsersQuery } from "./usersApiSlice"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import User from "./User"
import useTitle from "../../hooks/useTitle"
import { isErrorWithMessage, isFetchBaseQueryError } from "../../lib/utils"
import Loading from "../../components/Loading"

const UsersList = () => {
  useTitle("Users List")

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  let content: JSX.Element | null = null

  if (isLoading)
    content = (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )

  if (isError) {
    if (isFetchBaseQueryError(error) && isErrorWithMessage(error.data)) {
      content = (
        <p className="text-red-600 font-bold mb-4 text-center">
          {error.data?.message}
        </p>
      )
    }
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
