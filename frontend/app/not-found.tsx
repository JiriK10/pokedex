import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center py-48">
      <div className="text-9xl">🫥</div>
      <h1 className="text-4xl py-8">Sorry, it is not there.</h1>
      <Link href="/" className="text-xl">
        Here you can return home. 😉
      </Link>
    </div>
  )
}
