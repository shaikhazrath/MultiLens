'use client'
import TweetCard from '@/components/tweetcard'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { account, database, ID, Query } from '@/lib/appwrite'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { ConvReply } from '@/lib/bots'
const page = () => {
  const { id } = useParams()
  const [comment, setComment] = useState([])
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState([])
  const [mainPost, setMainPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyLoading, setReplyLoading] = useState(false)
  const bottomRef = useRef(null)

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const findParent = async (parentID, comments = []) => {
    try {
      const response = await database.getDocument(
        '6774c0ea003be44e7108',
        '6774e986002f3b70fbbb',
        parentID
      )
      const updatedComments = [response, ...comments]
      if (response.parentID !== null) {
        return findParent(response.parentID, updatedComments)
      }
      return updatedComments
    } catch (error) {
      console.error('Error fetching parent comment:', error)
      return comments
    }
  }

  const getComments = async () => {
    try {
      const response = await database.getDocument(
        '6774c0ea003be44e7108',
        '6774e986002f3b70fbbb',
        id
      )
      if (response.parentID !== null) {
        const parentComments = await findParent(response.parentID, [response])
        setComment(parentComments)
        setMainPost(parentComments[0].post + parentComments[0].comment)
      } else {
        setComment([response])
        setMainPost(response.post)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getReply = async () => {
    try {
      const response = await database.listDocuments(
        '6774c0ea003be44e7108',
        '6774e986002f3b70fbbb',
        [Query.equal('parentID', id)]
      )
      setReplies(response.documents)
    } catch (error) {
      console.error('Error fetching replies:', error)
    }
  }

  const handleReply = async () => {
    setReplyLoading(true)
    try {
      const userId = await account.get()
      const data = {
        parentID: id,
        comment: reply,
        character: 'user',
        userId: userId.$id
      }
      await database.createDocument(
        '6774c0ea003be44e7108',
        '6774e986002f3b70fbbb',
        ID.unique(),
        data
      )
      setReply('')
      await ConvReply(mainPost, comment, replies, reply);
      getReply();

      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setReplyLoading(false)
    }
  }

  useEffect(() => {
    getComments()
    getReply()
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [comment, replies])

  const getSupport = async (role) => {
    try {
      console.log('hi')
      await ConvReply(mainPost, comment, replies, reply,role);
      getReply();
    }
    catch (error) {
      console.error('Error fetching support:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }



  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {mainPost && (
          <TweetCard
            user="user"
            timestamp={mainPost.$createdAt}
            post={mainPost.post}
            id={mainPost.$id}
          />
        )}
        {comment.map((c) => (
          <div key={c.$id} className="mt-4">
            <TweetCard
              user={c.character}
              timestamp={c.$createdAt}
              post={c.comment}
              id={c.$id}
            />
          </div>
        ))}
        <div className="mt-4">
          {replies.map((r) => (
            <div key={r.$id} className="mt-4">
              <TweetCard
                user={r.character}
                timestamp={r.$createdAt}
                post={r.comment}
                id={r.$id}
              />
            </div>
          ))}
        </div>
        {/* Dummy div for scroll targeting */}
        <div ref={bottomRef}></div>
      </div>
      <div className=" border-t border-gray-200 sticky bottom-0 bg-black">
        <div className='p-2 flex gap-2'>
          <Button
          onClick={()=>getSupport('supportive friend')}
          >supportive friend</Button>
           <Button
          onClick={()=>getSupport('indian Uncle')}
          >indian Uncle</Button>
          <Button
          onClick={()=>getSupport('Troller')}
          >Troller</Button>
        </div>
        <div className='flex gap-2 px-4 pb-4'>
        <Textarea
          className="flex-1"
          placeholder="Reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <Button onClick={handleReply} disabled={replyLoading}>
          {replyLoading ? 'Replying...' : 'Reply'}
        </Button>
        </div>
        
      </div>
    </div>
  )
}

export default page
