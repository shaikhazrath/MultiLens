'use client';
import { use, useEffect, useState,CSSProperties  } from 'react';
import TweetInput from '@/components/tweet-input';
import Tweet from '@/components/tweet';
import { client, database, ID, account,Query } from '@/lib/appwrite';
import { reply } from '@/lib/bots';
import { useRouter } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const router = useRouter();
 
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);
  const getTweets = async () => {
    try {
      const userID = await account.get()
      const response = await database.listDocuments(
        '6774c0ea003be44e7108',
        '6774c0f3000a5eb102a8',
        [
          Query.limit(5),
          Query.equal("user", userID.$id),
          Query.orderDesc("$createdAt")
        ]

      );
      console.log(response.documents)
      setTweets(response.documents);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  };
  const handleTweetSubmit = async (content) => {
    try {
      const userId = await account.get()
      const response = await database.createDocument(
        '6774c0ea003be44e7108',
        '6774c0f3000a5eb102a8',
        ID.unique(),
        {
          post: content,
          user: userId.$id,
        }
        
      );
setCommentsLoading(true);
      await reply(response.$id, response.post);
      setCommentsLoading(false);
      getTweets();      
    } catch (error) {
      console.error('Error submitting tweet:', error);
      setCommentsLoading(false);

    }
  };

  const handleReply = (tweetId, replyContent) => {
    console.log(`Reply to tweet ${tweetId}: ${replyContent}`);
  };

  useEffect(() => {

    getTweets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <ClipLoader color="#ffffff" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div>
            <main className="min-h-screen bg-black">
      <div className="container mx-auto max-w-2xl bg-background min-h-screen">
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4 sticky top-0 z-10 flex gap-2">
          <h1 className="text-2xl font-bold text-primary">ECHO-AI</h1>
        </header>
        <p className=' text-xs px-5 py-2 text-secondary'>Welcome to ECHO-AI, a unique social media platform where you can share your thoughts, situations, or anything you usually post on social media. Here, AI with different perspectives will comment and help you handle situations, providing you with better insights from various mindsets.</p>  
        <div className="p-4">
          <TweetInput onTweetSubmit={handleTweetSubmit} />
          {commentsLoading && (
            <div className="flex items-center justify-center">
              <ClipLoader color="#ffffff" loading={commentsLoading} size={20} />
            </div>
          )}
          <div className="mt-8 space-y-4">
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.$id}
                id={tweet.$id}
                comments={tweet.comments}
                character={tweet.character}
                content={tweet.post}
                timestamp={tweet.$createdAt}
                onReply={handleReply}
              />
            ))}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
