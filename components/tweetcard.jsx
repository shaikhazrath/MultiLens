import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { MessageCircle, Repeat, Heart, Bookmark } from 'lucide-react';
import { formatDistance, formatDistanceToNow } from 'date-fns';

const TweetCard = ({user,timestamp,post,id}) => {
    return (
        <div className=' p-4'>
            <div className='flex space-x-3 items-start'>
                <div className='hidden sm:block'>
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
       
                <div className='flex-1'>
                    <div className='flex items-center space-x-2'>
                        <h1 className='text-md font-bold'>{user == 'user' ? 'hazrath':'Ai'}</h1>
                        <span className='text-sm text-gray-500'>({user}) · {formatDistanceToNow(timestamp)}</span>
                    </div>
                    <p className='mt-1 text-white'>
                      {post}
                    </p>
     {/* <div className='flex space-x-4 mt-2 text-gray-500 w-1/2 pt-2 justify-between'>
     <a href={`/reply/${id}`} className='flex items-center space-x-1 hover:text-blue-500'>
         <MessageCircle size={16} />
     </a>
     <button className='flex items-center space-x-1 hover:text-green-500'>
         <Repeat size={16} />
     </button>
     <button className='flex items-center space-x-1 hover:text-red-500'>
         <Heart size={16} />
     </button>
     <button className='flex items-center space-x-1 hover:text-yellow-500'>
         <Bookmark size={16} />
     </button>
 </div> */}
               
                </div>
            </div>
        </div>
    )
}

export default TweetCard