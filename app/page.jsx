'use client';
import { use, useEffect, useState } from 'react';
import TweetInput from '@/components/tweet-input';
import Tweet from '@/components/tweet';
import { client, database, ID, account,Query } from '@/lib/appwrite';
import { reply } from '@/lib/bots';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

      await reply(response.$id, response.post);
      setTweets((prevTweets) => [response, ...prevTweets]);
    } catch (error) {
      console.error('Error submitting tweet:', error);
    }
  };

  const handleReply = (tweetId, replyContent) => {
    console.log(`Reply to tweet ${tweetId}: ${replyContent}`);
  };

  useEffect(() => {
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
    getTweets();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto max-w-2xl bg-background min-h-screen">
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border p-4 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-primary">ECHO-AI</h1>
        </header>
        <div className="p-4">
          <TweetInput onTweetSubmit={handleTweetSubmit} />
          <div className="mt-8 space-y-4">
            {tweets.map((tweet) => (
              <Tweet
                key={tweet.$id}
                id={tweet.$id}
                comments={tweet.comments}
                character={tweet.character}
                content={tweet.post}
                timestamp={tweet.datetime}
                onReply={handleReply}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
