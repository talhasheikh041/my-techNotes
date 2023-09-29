import { Link } from "react-router-dom"

const DashHeader = () => {
  return (
    <header className="pb-4 border-b">
      <Link to="/dash">
        <h1 className="text-5xl">techNotes</h1>
      </Link>
      <nav>{/* add nav buttons later */}</nav>
    </header>
  )
}
export default DashHeader
