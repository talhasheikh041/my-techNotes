import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {
  return (
    <section className="p-8 h-screen flex flex-col">
      <DashHeader />
      <div className="lg:flex lg:justify-center">
        <Outlet />
      </div>
      <DashFooter />
    </section>
  )
}
export default DashLayout
