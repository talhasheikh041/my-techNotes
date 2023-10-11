import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { useGetNotesQuery } from "./notesApiSlice"

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Note from "./Note"
import useAuth from "../../hooks/useAuth"
import { EntityId } from "@reduxjs/toolkit"
import { isErrorWithMessage, isFetchBaseQueryError } from "../../lib/utils"
import useTitle from "../../hooks/useTitle"
import Loading from "../../components/Loading"

const NotesList = () => {
  useTitle("Notes List")

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 120000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  })

  const { isAdmin, isManager, username } = useAuth()

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
    const { ids, entities } = notes

    let filteredIds: EntityId[]
    if (isAdmin || isManager) {
      filteredIds = [...ids]
    } else {
      filteredIds = ids.filter(
        (noteId) => entities[noteId]?.username === username
      )
    }

    const notesContent =
      filteredIds.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />)

    content = (
      <Table className="mt-8 lg:w-3/4 mx-auto">
        <TableHeader>
          <TableRow className="lg:text-lg">
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Created
            </TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Updated
            </TableHead>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Owner
            </TableHead>
            <TableHead className="text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{notesContent}</TableBody>
      </Table>
    )
  }

  return content
}
export default NotesList
