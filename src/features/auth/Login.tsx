import React, { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useAppDispatch } from "../../hooks/reduxHooks"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"
import { isErrorWithMessage, isFetchBaseQueryError } from "../../lib/utils"
import { useToast } from "../../components/ui/use-toast"
import Loading from "../../components/Loading"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { ArrowBigLeft } from "lucide-react"
import usePersist from "../../hooks/usePersist"
import { Checkbox } from "../../components/ui/checkbox"

const Login = () => {
  const userRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrMsg("")
  }, [username, password])

  useEffect(() => {
    if (errMsg) {
      toast({
        title: "Login Failed",
        description: errMsg,
        variant: "destructive",
      })
    }
  }, [errMsg])

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value)

  const handlePwdInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value)

  const handleToggle = () => setPersist((prev) => !prev)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername("")
      setPassword("")
      navigate("/dash")
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        if (typeof error.status !== "number") {
          setErrMsg("No Server Response")
        } else if (error.status === 400) {
          setErrMsg("Missing Username or Password")
        } else if (error.status === 401) {
          setErrMsg("Unauthorized")
        } else {
          isErrorWithMessage(error.data) && setErrMsg(error.data.message)
        }
      }
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    )

  const content = (
    <section className="">
      <header className="py-8 mx-6 border-b">
        <h1 className="text-4xl">Employee Login</h1>
      </header>
      <main className="p-6 lg:w-1/3">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Label className="lg:text-base" htmlFor="username">
            Username:
          </Label>
          <Input
            className=""
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <Label className="lg:text-base" htmlFor="password">
            Password:
          </Label>
          <Input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />

          <Label className="lg:text-base flex items-center gap-2">
            <Checkbox checked={persist} onCheckedChange={handleToggle} />
            Trust This Device
          </Label>

          <Button className="w-1/4 mx-auto mt-4">Sign In</Button>
        </form>
      </main>
      <footer className="mx-6">
        <Link className="hover:underline flex" to="/">
          <span>
            <ArrowBigLeft />
          </span>
          Back to Home
        </Link>
      </footer>
    </section>
  )

  return content
}
export default Login
