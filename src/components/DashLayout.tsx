import { Outlet } from "react-router-dom"
import DashHeader from "./DashHeader"
import DashFooter from "./DashFooter"

const DashLayout = () => {
  return (
    <section className="p-8 h-screen flex flex-col">
      <DashHeader />
      <div className="">
        <Outlet />
      </div>
      <DashFooter />
    </section>
  )
}
export default DashLayout
