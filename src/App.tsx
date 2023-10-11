import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import Layout from "./components/Layout"
import DashLayout from "./components/DashLayout"
import Public from "./components/Public"
import Login from "./features/auth/Login"
import Welcome from "./features/auth/Welcome"
import NotesList from "./features/notes/NotesList"
import UsersList from "./features/users/UsersList"
import NewUser from "./features/users/NewUser"
import NewNote from "./features/notes/NewNote"
import Prefetch from "./features/auth/Prefetch"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import { ROLES } from "./config/roles"
import useTitle from "./hooks/useTitle"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Public />} />
      <Route path="login" element={<Login />} />

      <Route element={<PersistLogin />}>
        <Route
          element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
        >
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              <Route
                element={
                  <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                }
              >
                <Route path="users">
                  <Route index element={<UsersList />} />
                  <Route path="new" element={<NewUser />} />
                </Route>
              </Route>

              <Route path="notes">
                <Route index element={<NotesList />} />
                <Route path="new" element={<NewNote />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
)

function App() {
  useTitle("Dan.D Repairs")

  return <RouterProvider router={router} />
}

export default App
