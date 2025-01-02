import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "echo-ai",
  description: "Welcome to ECHO-AI, a unique social media platform where you can share your thoughts, situations, or anything you usually post on social media. Here, AI with different perspectives will comment and help you handle situations, providing you with better insights from various mindsets",
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

