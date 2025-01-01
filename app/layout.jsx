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
        {children}
        </body>
    </html>)
  );
}

