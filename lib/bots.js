import Groq from "groq-sdk";
import { account, database, databse,ID } from "./appwrite";
const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });

const systemRoles = [
  {
    "role": "system",
    "content": "Reply to a social media post like a motivational speaker, the reply should be related to the post only offering uplifting and encouraging words to inspire positivity and growth. The reply should be max or equal to 40 words, simple, and easy to understand without buzzwords.",
    "character": "motivational speaker"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a philosopher, the reply should be related to the post only with deep and thought-provoking insights to stimulate the user's mind. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "philosopher"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a bully, the reply should be related to the post only using sarcastic and mocking language to provoke a reaction. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "bully"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a supportive friend, with caring, the reply should be related to the post only understanding, and friendly advice to make the user feel heard. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "supportive friend"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a problem solver, offering clear, the reply should be related to the post only practical solutions to address the user’s issues or concerns. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "problem solver"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a realist, providing grounded, the reply should be related to the post only practical, and honest feedback without sugar-coating. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "realist"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like a bully, the reply should be related to the post only with sharp and cutting remarks aimed at ridiculing the user. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "troller"
  },
  {
    "role": "system",
    "content": "Reply to a social media post like an encourager, offering kind, the reply should be related to the post only warm, and gentle words to lift the user's spirits. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "encourager"
  },
  {
    "role": "system",
    "content": "Reply to a social media post with a demotivating tone, the reply should be related to the post only highlighting challenges and obstacles, making the user question their choices. The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.",
    "character": "demotivator"
  },
 
];


async function getpromps(post, systemRole) {
  return groq.chat.completions.create({
    messages: [
      {
        role: systemRole.role,
        content: systemRole.content,
      },
      {
        role: "user",
        content: post,
      },
    ],
    temperature: 0.5,
    max_tokens: 40,
    top_p: 1,
    model: "llama-3.3-70b-versatile",
  });
}

export const reply = async (id, post) => {
  try {
    const userID = await account.get();
    for (const systemRole of systemRoles) {
      const chatCompletion = await getpromps(post, systemRole);
      console.log(chatCompletion.choices[0]?.message?.content || "");
      const comment = chatCompletion.choices[0]?.message?.content || "";
      console.log(systemRole.character);
      const data = {
        post: id,
        comment,
        // userID: userID.$id,
        character: systemRole.character
      };
      await database.createDocument(
        "6774c0ea003be44e7108",
        "6774e986002f3b70fbbb",
        ID.unique(),
        data
      );
    }
  } catch (error) {
    console.error("Error processing reply:", error);
    await database.deleteDocument("6774c0ea003be44e7108", id);
  }
};


const getPromptReply = async (conversation,roal,reply) => {
  return groq.chat.completions.create({
    messages: [
      {
        role:"system",
        content: `Reply to a social media post in comment section as a ${roal} the context of the conversation is this ${conversation} The reply should be max or equal to 60 words, simple, and easy to understand without buzzwords.`,
      },
      {
        role: "user",
        content: reply,
      },
    ],
    temperature: 0.5,
    max_tokens: 40,
    top_p: 1,
    model: "llama-3.3-70b-versatile",
  });
};




export const ConvReply = async (mainpost, all_comments, replies, reply, role) => {
  try {
    const characterRole = role ? role :  all_comments[0].character;
    const combinedReplies = [
      { cmt: mainpost.post, chr: 'user' },
      ...all_comments.slice(-5).map(comment => ({ cmt: comment.comment, chr: comment.character })),
      ...replies.slice(-5).map(reply => ({ cmt: reply.comment, chr: reply.character }))
    ];
    const c = JSON.stringify(combinedReplies,characterRole)
    const chatCompletion = await getPromptReply(c,characterRole, reply);
    console.log(chatCompletion.choices[0]?.message?.content || "");

    const comment = chatCompletion.choices[0]?.message?.content || "";
    const data = {
      parentID: all_comments[0].$id,
      comment,
      character: characterRole
    };

    await database.createDocument(
      "6774c0ea003be44e7108",
      "6774e986002f3b70fbbb",
      ID.unique(),
      data
    );
  } catch (error) {
    console.error("Error processing reply:", error);
  }
};
