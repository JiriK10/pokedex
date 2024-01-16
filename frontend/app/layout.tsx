import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Providers } from "@/lib/providers"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import "./styles/globals.scss"
import Toasts from "./components/Toasts"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pokedex",
}
export const viewport = { width: "device-width", initialScale: 1 }

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toasts />
        </body>
      </html>
    </Providers>
  )
}
