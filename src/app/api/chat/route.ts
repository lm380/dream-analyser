// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';
export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `List the key elements and symbols in the following dream denote the start of the list with the following
           "Key elements and symbols in the dream:". Denote the end of the list with the phrase,
           "END OF ELEMENTS FOR ANALYSIS". On a new line, give a break down and analysis of what the dream might mean. 
           If you see the phrase, "Context for analysis" please use this as added context from the users life, to use for
           the analysis of the dream`,
      },
      ...messages,
    ],
    temperature: 1,
    stream: true,
  });

  const stream = OpenAIStream(
    res
    //      {
    //     // This function is called when the API returns a response
    //     async onCompletion(completion: any) {
    //       const title = json.messages[0].content.substring(0, 100);
    //       const id = json.id;
    //       const createdAt = Date.now();
    //       const path = `/chat/${id}`;
    //       const payload = {
    //         id,
    //         title,
    //         completion,
    //         createdAt,
    //         path,
    //       };
    //       console.log(payload);
    //       // Here you can store the chat in database
    //       // ...
    //     },
    //   }
  );

  return new StreamingTextResponse(stream);
}
