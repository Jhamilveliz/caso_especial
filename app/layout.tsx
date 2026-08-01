import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CasoEspecialProvider } from "@/lib/store"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Caso Especial — FICCT UAGRM",
  description: "Generador de solicitudes de caso especial universitario",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen w-full relative overflow-hidden">
          {/* Gradiente base */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(125% 125% at 50% 10%, #fff 40%,rgb(3, 48, 110) 100%)",
            }}
          />
          {/* Blobs animados */}
          <div
            className="blob blob-a"
            style={{ width: 520, height: 520, top: "-10%", left: "-8%" }}
          />
          <div
            className="blob blob-b"
            style={{ width: 460, height: 460, bottom: "-12%", right: "-10%" }}
          />
          <div
            className="blob blob-c"
            style={{ width: 380, height: 380, top: "40%", left: "55%" }}
          />
          <div className="relative z-10">
            <CasoEspecialProvider>
              {children}
            </CasoEspecialProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
