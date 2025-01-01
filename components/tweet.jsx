'use client';
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Repeat2, Star } from 'lucide-react'
import TweetInput from './tweet-input'
import { database, Query } from '@/lib/appwrite';

export default function Tweet({
  id,
  content,
  comments,
  character,
  timestamp,
  onReply
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replies, setReplies] = useState([])

  const [showAllComments, setShowAllComments] = useState(false);

  const handleShowAllComments = () => {
    setShowAllComments(true);
  };


  const handleReplySubmit = (replyContent) => {
    onReply(id, replyContent)
    const newReply = {
      id: Date.now(),
      content: replyContent,
      timestamp: new Date(),
    }
    setReplies(prevReplies => [newReply, ...prevReplies])
    setShowReplyInput(false)
  }


  return (
    (<div
      className=" border-border p-4  transition-colors duration-200" key={id}>
      <div className="flex space-x-3">
        
        <Avatar className="w-10 h-10 hidden sm:block">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {
              character ? (
                <span className="font-bold text-primary truncate">Bot
                  <span className='pl-2 text-sm text-muted-foreground'>
                    ({character})
                  </span>
                </span>
              ) : (
                <span className="font-bold text-primary truncate">User</span>
              )
            }
            
            <span className="text-muted-foreground text-sm truncate">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="text-primary break-words">{content}</p>
          {/* <div className="mt-3 flex justify-between sm:justify-start sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-accent p-0 h-auto"
              onClick={() => setShowReplyInput(!showReplyInput)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reply </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-accent p-0 h-auto">
              <Repeat2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Retweet</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-accent p-0 h-auto">
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Like</span>
            </Button>
          </div> */}
          {/* {showReplyInput && (
            <div className="mt-3">
              <TweetInput onTweetSubmit={handleReplySubmit} placeholder="Tweet your reply" />
            </div>
          )} */}
          <div className="mt-4 space-y-4 pl-4 sm:pl-6 border-l border-border">
            {
              showAllComments ? comments && comments.map(c => (
                <Tweet
                  key={c.$id}
                  id={c.$id}
                  content={c.comment}
                  character={c.character}
                  timestamp={c.$createdAt}
                  onReply={handleReplySubmit} />
              ))
              :
              comments && comments.slice(0, 2).map(c => (
                <Tweet
                  key={c.$id}
                  id={c.$id}
                  content={c.comment}
                  character={c.character}
                  timestamp={c.$createdAt}
                  onReply={handleReplySubmit} />
              ))
            }
            {
              comments && comments.length > 2 && !showAllComments && <button onClick={handleShowAllComments} className="text-blue-500">Show all comments</button>
            }
            {
              showAllComments && (
                <button onClick={() => setShowAllComments(false)} className="text-blue-500">Close comments</button>
              )
            }
          </div>
        </div>
      </div>
    </div>)
  );
}

