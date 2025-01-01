'use client';
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const MAX_CHARS = 280

export default function TweetInput({
  onTweetSubmit,
  placeholder = "What's happening?"
}) {
  const [tweet, setTweet] = useState('')

  const handleInputChange = (e) => {
    setTweet(e.target.value)
  }

  const handlePost = () => {
    if (tweet.trim().length > 0 && tweet.length <= MAX_CHARS) {
      onTweetSubmit(tweet)
      setTweet('') // Clear the input after posting
    }
  }

  const charsLeft = MAX_CHARS - tweet.length
  const isOverLimit = charsLeft < 0

  return (
    (<div className="bg-background rounded-lg shadow p-4 ">
      <div className="flex space-x-4">
        <Avatar className="w-10 h-10 hidden sm:block">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder={placeholder}
            value={tweet}
            onChange={handleInputChange}
            className="w-full p-2 text-lg resize-none bg-background text-primary border-b-1 focus:ring-0"
            rows={3} />
          <div className="flex items-center justify-between">
            <span
              className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charsLeft}
            </span>
            <Button
              onClick={handlePost}
              disabled={tweet.length === 0 || isOverLimit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>)
  );
}

