import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Orla Resort - Dove il Lusso Incontra l'Orizzonte",
  description: "Vivi un'esperienza senza tempo nel cuore di Lido degli Estensi",
  generator: "orla",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className={`font-sans ${poppins.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
