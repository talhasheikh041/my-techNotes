import React, { useState, useEffect } from "react"
import {
  UserStateType,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "./usersApiSlice"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { isErrorWithMessage, isFetchBaseQueryError } from "@/lib/utils"
import { PenSquare } from "lucide-react"

type EditUserProps = {
  user: UserStateType
}

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUser = ({ user }: EditUserProps) => {
  const { toast } = useToast()
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation()

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation()

  const [dialogOpen, setDialogOpen] = useState(false)

  const [username, setUsername] = useState(user.username)
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [userRoles, setUserRoles] = useState(user.roles)
  const [active, setActive] = useState(user.active)

  const [rolesBool, setRolesBool] = useState({
    Employee: userRoles.includes("Employee"),
    Admin: userRoles.includes("Admin"),
    Manager: userRoles.includes("Manager"),
  })

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password))
  }, [password])

  useEffect(() => {
    console.log(isSuccess)
    if (isSuccess || isDelSuccess) {
      setDialogOpen(false)
    }
  }, [isSuccess, isDelSuccess])

  useEffect(() => {
    if (!isDelError) return

    if (isFetchBaseQueryError(delerror) && isErrorWithMessage(delerror.data)) {
      toast({
        title: "Cannot delete User",
        description: delerror.data.message,
        variant: "destructive",
      })
    }
  }, [isDelError])

  useEffect(() => {
    if (!isError) return

    if (isFetchBaseQueryError(error) && isErrorWithMessage(error.data)) {
      toast({
        title: "Cannot update User",
        description: error.data.message,
        variant: "destructive",
      })
    }
  }, [isError])

  useEffect(() => {
    setUserRoles(
      Object.keys(rolesBool).filter(
        (key) => rolesBool[key as keyof typeof rolesBool]
      )
    )
  }, [rolesBool])

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value)

  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)

  const onActiveChanged = () => setActive((prev) => !prev)

  const onRolesChanged = (checked: boolean, name: string) => {
    const checkValue = Object.values(rolesBool).filter((role) => role).length

    if (checkValue === 1 && !checked) {
      console.log("running")
      toast({
        title: "Not Allowed",
        description: "You have to select atleast one role for an employee.",
        variant: "destructive",
      })
      return
    }

    setRolesBool((prev) => {
      return {
        ...prev,
        [name]: checked,
      }
    })
  }

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password) {
      const result = await updateUser({
        id: user.id,
        username,
        password,
        roles: userRoles,
        active,
      })

      "data" in result &&
        toast({
          title: result.data.message,
        })
    } else {
      const result = await updateUser({
        id: user.id,
        username,
        roles: userRoles,
        active,
      })

      "data" in result &&
        toast({
          title: result.data.message,
        })
    }
  }

  const onDeleteUserClicked = async () => {
    const result = await deleteUser({ id: user.id })

    "data" in result &&
      toast({
        title: result.data.toString(),
      })
  }

  const rolesOptions = Object.entries(rolesBool).map(([name, checked]) => {
    return (
      <DropdownMenuCheckboxItem
        key={name}
        checked={checked}
        onCheckedChange={(checked) => onRolesChanged(checked, name)}
      >
        {name}
      </DropdownMenuCheckboxItem>
    )
  })

  let canSave: boolean
  if (password) {
    canSave =
      [userRoles.length, validUsername, validPassword].every(Boolean) &&
      !isLoading
  } else {
    canSave = [userRoles.length, validUsername].every(Boolean) && !isLoading
  }

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
          <DialogTitle className="text-lg">Edit User</DialogTitle>

          <DialogDescription>
            Make changes to user here. Click save when you're done
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSaveUserClicked}>
          <Label className="" htmlFor="username">
            Username
          </Label>

          <Input
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
            className={`mt-2 ${
              !validUsername
                ? "focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                : ""
            }`}
            id="username"
            type="text"
          />

          <Label className="" htmlFor="password">
            Password
          </Label>

          <Input
            value={password}
            onChange={onPasswordChanged}
            className={`mt-2 ${
              !validPassword
                ? "focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2"
                : ""
            }`}
            id="password"
            type="password"
          />

          <div className="flex items-center mt-4 gap-1">
            <Checkbox
              checked={active}
              onCheckedChange={onActiveChanged}
              id="active"
              className="text-md"
            />
            <Label htmlFor="active">Active</Label>
          </div>

          <div className="mt-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Roles</Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Roles</DropdownMenuLabel>

                <DropdownMenuSeparator />

                {rolesOptions}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogFooter className="mt-6 flex flex-col gap-2">
            <Button type="submit" disabled={!canSave}>
              Save changes
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDeleteUserClicked}
            >
              Delete User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )

  return content
}

export default EditUser
