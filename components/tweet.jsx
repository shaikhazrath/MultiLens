'use client';
import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart, Repeat2, Star } from 'lucide-react'
import TweetInput from './tweet-input'
import { database, Query } from '@/lib/appwrite';
import { motion } from 'framer-motion';

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



  const commentVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="border-border p-4 transition-colors duration-200" key={id}>
      <div className="flex space-x-3">
        <Avatar className="w-10 h-10 hidden sm:block">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            {character ? (
              <span className="font-bold text-primary truncate">
                Bot
                <span className="pl-2 text-sm text-muted-foreground">
                  ({character})
                </span>
              </span>
            ) : (
              <span className="font-bold text-primary truncate">User</span>
            )}
            <span className="text-muted-foreground text-sm truncate">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="text-primary break-words">{content}</p>

          <div className="mt-4 space-y-4 pl-4 sm:pl-6 border-l border-border">
            {showAllComments
              ? comments &&
                comments.map((c, index) => (
                  <motion.div
                    key={c.$id}
                    initial="hidden"
                    animate="visible"
                    variants={commentVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Tweet
                      id={c.$id}
                      content={c.comment}
                      character={c.character}
                      timestamp={c.$createdAt}
                      onReply={handleReplySubmit}
                    />
                  </motion.div>
                ))
              : comments &&
                comments.slice(0, 2).map((c, index) => (
                  <motion.div
                    key={c.$id}
                    initial="hidden"
                    animate="visible"
                    variants={commentVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Tweet
                      id={c.$id}
                      content={c.comment}
                      character={c.character}
                      timestamp={c.$createdAt}
                      onReply={handleReplySubmit}
                    />
                  </motion.div>
                ))}
            {comments && comments.length > 2 && !showAllComments && (
              <button
                onClick={handleShowAllComments}
                className="text-blue-500"
              >
                Show all comments
              </button>
            )}
            {showAllComments && (
              <button
                onClick={() => setShowAllComments(false)}
                className="text-blue-500"
              >
                Close comments
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

