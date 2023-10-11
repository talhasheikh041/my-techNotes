import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserStateType, useGetUsersQuery } from "../users/usersApiSlice"
import { useCreateNewNoteMutation } from "./notesApiSlice"
import { isErrorWithMessage, isFetchBaseQueryError } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Loading from "../../components/Loading"
import useTitle from "../../hooks/useTitle"

const NewNote = () => {
  useTitle("Add new note")

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => {
      if (data) {
        return {
          users: data.ids.map((id) => data.entities[id]) as UserStateType[],
        }
      } else {
        return {
          users: [],
        }
      }
    },
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  if (!users?.length)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )

  const [createNote, { isLoading, isSuccess, isError, error }] =
    useCreateNewNoteMutation()

  const [userId, setUserId] = useState(users[0].id)
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")

  useEffect(() => {
    if (isSuccess) {
      setTitle("")
      setText("")
      setUserId("")
      navigate("/dash/notes")
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (isError) {
      if (isFetchBaseQueryError(error) && isErrorWithMessage(error.data)) {
        toast({
          title: "Cannot create note!",
          description: error.data.message,
          variant: "destructive",
        })
      }
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

  const options = users.map((user) => {
    return (
      <SelectItem key={user.id} value={user.id as string}>
        {user.username}
      </SelectItem>
    )
  })

  const onSaveNoteClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      const result = await createNote({ user: userId, title, text })

      "data" in result &&
        toast({
          title: result.data.message,
        })
    }
  }

  const content = (
    <>
      <h1 className="text-4xl font-bold text-center mt-8">Create a new note</h1>
      <form
        className="mt-8 lg:max-w-2xl mx-auto flex flex-col gap-3"
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

        <Label>Assigned To:</Label>
        <Select value={userId} onValueChange={onUserIdChanged}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>{options}</SelectContent>
        </Select>

        <Button
          className="block w-1/2 mx-auto mt-8"
          type="submit"
          disabled={!canSave}
        >
          Save changes
        </Button>
      </form>
    </>
  )

  return content
}
export default NewNote
