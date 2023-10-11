import { useGetNotesQuery } from "./notesApiSlice"
import { EntityId } from "@reduxjs/toolkit"
import { TableCell, TableRow } from "@/components/ui/table"
import EditNote from "./EditNote"
import { memo } from "react"

type NoteProps = {
  noteId: EntityId
}

const Note = ({ noteId }: NoteProps) => {
  const { note } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      note: data?.entities[noteId],
    }),
  })

  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    })

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    })

    const status = note.completed ? "Completed" : "Open"

    const statusClass = note.completed ? "text-green-500" : "text-orange-500"

    return (
      <>
        <TableRow className="lg:text-base">
          <TableCell className={`${statusClass} text-center`}>
            {status}
          </TableCell>
          <TableCell className="text-center hidden lg:table-cell">
            {created}
          </TableCell>
          <TableCell className="text-center hidden lg:table-cell">
            {updated}
          </TableCell>
          <TableCell className="text-center">{note.title}</TableCell>
          <TableCell className="text-center hidden lg:table-cell">
            {note.username}
          </TableCell>
          <TableCell className="text-center">
            <EditNote note={note} />
          </TableCell>
        </TableRow>
      </>
    )
  } else return null
}

const memoizedNote = memo(Note)

export default memoizedNote
