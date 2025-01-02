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
    <html lang="en" className="dark">
      <body className={`${inter.className} flex items-center justify-center min-h-screen bg-gray-900 text-white`}>
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Site Temporarily Unavailable</h1>
          <p className="text-lg mb-4">Due to high traffic, the site is temporarily unavailable. Please check back later.</p>
          <p className="text-sm text-gray-400">We apologize for the inconvenience and appreciate your patience.</p>
        </div>
      </body>
    </html>
  );
}

