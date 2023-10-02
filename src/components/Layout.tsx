import { Outlet } from "react-router-dom"
import { Toaster } from "./ui/toaster"
import { ThemeProvider } from "./theme-provider"

const Layout = () => {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
      </ThemeProvider>
    </>
  )
}
export default Layout
