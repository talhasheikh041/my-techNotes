import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { LogIn } from "lucide-react"

const Public = () => {
  return (
    <section className="p-8 h-screen flex flex-col">
      <header className="pb-4 border-b">
        <h1 className="text-xl">Welcome to Dan D. Repairs!</h1>
      </header>
      <main className="py-6">
        <p className="">
          Located in Beautiful Downtown Foo City, Dan D. Repairs provides a
          trained staff ready to meet your tech repair needs.
        </p>
        <address className="mt-6">
          Dan D. Repairs
          <br />
          555 Foo Drive
          <br />
          Foo City, CA 12345
          <br />
          <a href="tel:+15555555555">(555) 555-5555</a>
        </address>
        <br />
        <p className="text-sm text-gray-400">Owner: Dan Davidson</p>
      </main>

      <footer className="mt-auto border-t w-full py-4">
        <Link to="/login">
          <Button variant="link" className="text-md">
            <span>Employee Login</span>
            <LogIn className="ml-3 w-6" />
          </Button>
        </Link>
      </footer>
    </section>
  )
}
export default Public
