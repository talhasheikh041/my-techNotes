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

const NotesList = () => {
  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery()

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
    const { ids } = notes

    const notesContent = ids.length
      ? ids.map((noteId) => <Note key={noteId} noteId={noteId} />)
      : null

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
