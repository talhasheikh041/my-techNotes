import { useState, useEffect } from "react"
import {
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  NoteStateType,
} from "./notesApiSlice"
import { useToast } from "@/components/ui/use-toast"
import { isErrorWithMessage, isFetchBaseQueryError } from "@/lib/utils"
import { useAppSelector } from "@/hooks/reduxHooks"
import { selectAllUsers } from "../users/usersApiSlice"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PenSquare } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import useAuth from "../../hooks/useAuth"

type EditNoteProps = {
  note: NoteStateType
}

const EditNote = ({ note }: EditNoteProps) => {
  const users = useAppSelector((state) => selectAllUsers(state))
  const { toast } = useToast()

  const { isManager, isAdmin } = useAuth()

  if (!users) return <p>Loading...</p>

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation()

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteNoteMutation()

  const [userId, setUserId] = useState(note.user)
  const [title, setTitle] = useState(note.title)
  const [text, setText] = useState(note.text)
  const [completed, setCompleted] = useState(note.completed)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      setDialogOpen(false)
    }
  }, [isSuccess, isDelSuccess])

  useEffect(() => {
    if (!isDelError) return

    if (isFetchBaseQueryError(delerror) && isErrorWithMessage(delerror.data)) {
      toast({
        title: "Cannot delete Note",
        description: delerror.data.message,
        variant: "destructive",
      })
    }
  }, [isDelError])

  useEffect(() => {
    if (!isError) return

    if (isFetchBaseQueryError(error) && isErrorWithMessage(error.data)) {
      toast({
        title: "Cannot update Note",
        description: error.data.message,
        variant: "destructive",
      })
    }
  }, [isError])

  const canSave = [title, text, userId].every(Boolean) && !isLoading

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value)

  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value)

  const onUserIdChanged = (value: string) => {
    setUserId(value)
  }

  const onCompletedChanged = () => setCompleted((prev) => !prev)

  const options = users.map((user) => {
    return (
      <SelectItem key={user.id} value={user.id as string}>
        {user.username}
      </SelectItem>
    )
  })

  const onSaveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("note updated")
    e.preventDefault()
    if (canSave) {
      const result = await updateNote({
        id: note.id,
        user: userId,
        title,
        text,
        completed,
      })

      "data" in result &&
        toast({
          title: result.data.message,
        })
    }
  }

  const onDeleteNoteClicked = async () => {
    const result = await deleteNote({ id: note.id })

    "data" in result &&
      toast({
        title: result.data.toString(),
      })
  }

  let deleteButton: JSX.Element | null = null
  if (isManager || isAdmin) {
    deleteButton = (
      <Button type="button" variant="destructive" onClick={onDeleteNoteClicked}>
        Delete note
      </Button>
    )
  }

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  const content = (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="link">
          <PenSquare
            className="hover:scale-150 transition-all duration-150"
            size="20px"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Edit Note #{note.ticket}
          </DialogTitle>

          <DialogDescription>
            Make changes to note here. Click save when you're done
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-8 lg:max-w-2xl flex flex-col gap-3"
          onSubmit={onSaveNoteClicked}
        >
          <Label className="lg:text-lg " htmlFor="title">
            Title
          </Label>

          <Input
            autoComplete="off"
            value={title}
            onChange={onTitleChanged}
            className={`mt-2 ${
              !title
                ? "focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                : ""
            }`}
            id="title"
            type="text"
          />

          <Label className="lg:text-lg" htmlFor="text">
            Text:
          </Label>

          <Textarea
            value={text}
            onChange={onTextChanged}
            className={`mt-2 ${
              !text
                ? "focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                : ""
            }`}
            id="text"
          />

          <div className="flex items-center mt-4 gap-1 mb-5">
            <Checkbox
              checked={completed}
              onCheckedChange={onCompletedChanged}
              id="completed"
              className="text-md"
            />
            <Label htmlFor="completed">Work Complete</Label>
          </div>

          <Label>Assigned to</Label>
          <Select value={userId} onValueChange={onUserIdChanged}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>{options}</SelectContent>
          </Select>

          <p className="text-xs mt-3 lg:text-sm">Created at: {created}</p>
          <p className="text-xs lg:text-sm">Updated at: {updated}</p>
          <DialogFooter className="mt-3 flex flex-col gap-2">
            <Button type="submit" disabled={!canSave}>
              Save note
            </Button>
            {deleteButton}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return content
}
export default EditNote
