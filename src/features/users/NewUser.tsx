import React, { useState, useEffect } from "react"
import { useCreateUserMutation } from "./usersApiSlice"

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
import { useNavigate } from "react-router-dom"
import { isErrorWithMessage, isFetchBaseQueryError } from "@/lib/utils"
import useTitle from "../../hooks/useTitle"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUser = () => {
  useTitle("Add new User")

  const { toast } = useToast()
  const navigate = useNavigate()

  const [createNewUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation()

  const [username, setUsername] = useState("")
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [validPassword, setValidPassword] = useState(false)
  const [userRoles, setUserRoles] = useState(["Employee"])
  const [active, setActive] = useState(false)

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
    if (isSuccess) {
      setUsername("")
      setPassword("")
      setUserRoles([])
      navigate("/dash/users")
    }
  }, [isSuccess, navigate])

  useEffect(() => {
    if (isError) {
      if (isFetchBaseQueryError(error)) {
        if (isErrorWithMessage(error.data)) {
          toast({
            title: "Cannot create User",
            description: error.data.message,
            variant: "destructive",
          })
        }
      }
    }
  }, [isError])

  useEffect(() => {
    setUserRoles(
      Object.keys(rolesBool).filter(
        (key) => rolesBool[key as keyof typeof rolesBool]
      )
    )
  }, [rolesBool])

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onActiveChanged = () => {
    setActive((prev) => !prev)
  }

  const onRolesChanged = (checked: boolean, name: string) => {
    const checkValue = Object.values(rolesBool).reduce((acc, val) => {
      return val ? acc + 1 : acc
    }, 0)

    if (checkValue === 1 && !checked) {
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

  const canSave =
    [userRoles.length, validUsername, validPassword].every(Boolean) &&
    !isLoading

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (canSave) {
      const result = await createNewUser({
        username,
        password,
        roles: userRoles,
      })

      "data" in result &&
        toast({
          title: result.data.message,
        })
    }
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

  const content = (
    <form className="mt-8 lg:max-w-2xl mx-auto" onSubmit={onSaveUserClicked}>
      <Label className="lg:text-lg" htmlFor="username">
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

      <Label className="lg:text-lg" htmlFor="password">
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
        <Label className="lg:text-md" htmlFor="active">
          Active
        </Label>
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
      <Button className="block w-1/2 mx-auto mt-8" type="submit">
        Save changes
      </Button>
    </form>
  )

  return content
}
export default NewUser
