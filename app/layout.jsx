import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Twitter-like Posting",
  description: "A simple Twitter-like posting system",
}

export default function RootLayout({
  children
}) {
  return (
    (<html lang="en" className="dark">

      <body className={inter.className}>
      <main className="min-h-screen bg-black">
      <div className="container mx-auto max-w-2xl bg-background min-h-screen">
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4 sticky top-0 z-10 flex gap-2">
          <h1 className="text-2xl font-bold text-primary">ECHO-AI</h1>
        </header>
        {children}
      </div>
      </main>
        </body>
    </html>)
  );
}

