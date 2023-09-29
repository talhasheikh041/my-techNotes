import { Link } from "react-router-dom"
import { PenSquare } from "lucide-react"

import { useAppSelector } from "@/hooks/reduxHooks"
import { selectNoteById } from "./notesApiSlice"
import { buttonVariants } from "@/components/ui/button"
import { EntityId } from "@reduxjs/toolkit"
import { TableCell, TableRow } from "@/components/ui/table"

type NoteProps = {
  noteId: EntityId
}

const Note = ({ noteId }: NoteProps) => {
  const note = useAppSelector((state) => selectNoteById(state, noteId))

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
            <Link
              className={buttonVariants({ variant: "link" })}
              to={`/dash/notes/${noteId}`}
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
export default Note
