// app/api/chat/route.ts
import { auth } from '@/auth';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';
import { extractDreamContent } from '@/app/utils/utilityfuncs';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prismaEdge = new PrismaClient({ adapter });

const getInfo = async () => {
  const info = await auth();
  const { name, email } = info?.user!;

  const user = await prismaEdge.user.findUnique({
    where: {
      email: email || '',
    },
  });
  return user;
};

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, previewToken } = json;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `List the key elements and symbols in the following dream. Denote the start of the list with the following
           "Key elements and symbols in the dream:". Denote the end of the list with the phrase,
           "END OF ELEMENTS FOR ANALYSIS". On a new line, give a break down and analysis of what the dream might mean. 
           If you see the phrase, "Context for analysis", in the users message, please use this as added context from the users life, to use for
           the analysis of the dream`,
      },
      ...messages,
    ],
    temperature: 1,
    stream: true,
  });

  const stream = OpenAIStream(
    res,
    {
      async onCompletion(completion: any) {
        const title = json.messages[0].content.substring(0, 100);
        const id = json.id;
        const createdAt = Date.now();
        const path = `/chat/${id}`;
        const payload = {
          id,
          title,
          completion,
          createdAt,
          path,
        };
        const elementList = extractDreamContent(completion, 'list') as string[];
        const analysis = extractDreamContent(completion, 'analysis') as string;

        console.log(elementList, analysis);
        const user = await getInfo();
        // console.log(user);

        const dreamDetails = {
          content: analysis,
          elements: elementList,
          title: title,
          dreamerId: user?.id || '',
        };

        try {
          await prismaEdge.dream.create({
            data: {
              title: title,
              content: analysis,
              keyElements: elementList,
              userId: user?.id || '',
            },
          });
        } catch (e) {
          console.error(e);
        }

        // const dream = await prismaEdge.dream.create({
        //   data: dreamDetails,
        // });

        // createDream(dreamDetails, prismaEdge);
      },
    }
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
