// app/api/chat/route.ts
import { auth } from '@/auth';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OpenAI } from 'openai';
import { extractDreamContent } from '@/app/utils/utilityFuncs';
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// export const runtime = 'edge';

const getInfo = async () => {
  const info = await auth();
  const { email } = info?.user!;

  const user = await prisma.user.findUnique({
    where: {
      email: email || '',
    },
  });
  return user;
};

const RATE_LIMIT = 100;

export async function POST(req: Request) {
  const json = await req.json();
  const { messages } = json;
  const user = await getInfo();
  const userEmail = user?.email;
  const lifeContext = user?.lifeContext;

  console.log(messages);

  try {
    const rateLimitData = await prisma.rateLimit.findUnique({
      where: { email: user?.email },
    });

    const currentTime = Date.now();
    const timeWindow = 60 * 60 * 1000 * 24 * 30; // 1 month
    const rateLimit = RATE_LIMIT;

    if (rateLimitData) {
      // Check if the rate limit is exceeded
      if (
        rateLimitData.timestamp > currentTime - timeWindow &&
        rateLimitData.count >= rateLimit
      ) {
        return NextResponse.json(
          { message: 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      // Update the rate limit count
      await prisma.rateLimit.update({
        where: { email: userEmail },
        data: {
          count:
            rateLimitData.timestamp > currentTime - timeWindow
              ? rateLimitData.count + 1
              : 1,
          timestamp: currentTime,
        },
      });
    } else {
      // Create a new rate limit record for the user
      await prisma.rateLimit.create({
        data: {
          email: userEmail || '',
          count: 1,
          timestamp: currentTime,
        },
      });
    }

    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
            You are an assistant that analyses dreams. If the input is nonsensical, respond with "invalid dream input"
            otherwise, list the key elements and symbols in the following dream. Don't number the key elements,
            just give a phrase or word describing the key element and precede each element with a "-" and use start case.
            Denote the start of the list with the following "KEY ELEMENTS AND SYMBOLS:". Denote the end of the list
            with the phrase, "END OF ELEMENTS:". On a new line give a theme of the dream, precede this with 
            the following, "THEME:".Finally, on a new line, give a break down and analysis of what the dream might mean 
            and precede this with the following "ANALYSIS:". 
           ${
             lifeContext &&
             `please use the following as added context from the users life, to use for
           the analysis of the dream: ${lifeContext}. It is important not to force the context into the analysis
           if there is an organic connection, then please mention it.`
           }`,
        },
        ...messages,
      ],
      temperature: 1,
      // stream: true,
    });

    const content = res.choices[0].message?.content || '';

    if (content === 'invalid dream input') {
      return NextResponse.json(
        { error: 'Invalid dream input' },
        { status: 400 }
      );
    }

    // Extract key elements, analysis, and theme
    const elementList = extractDreamContent(content, 'list') as string[];
    const analysis = extractDreamContent(content, 'analysis') as string;
    const theme = extractDreamContent(content, 'theme') as string;
    const title = `${elementList[0]} Dream`;

    // Save to database
    await prisma.dream.create({
      data: {
        title,
        content: messages[0].content,
        theme,
        analysis,
        keyElements: elementList,
        userId: user?.id || '',
      },
    });

    // Return the analysis, elements, and theme to the frontend
    return NextResponse.json({ analysis, elementList, theme }, { status: 200 });
  } catch (error) {
    console.error('Error processing dream analysis:', error);
    return NextResponse.json(
      { error: 'Failed to process dream analysis' },
      { status: 500 }
    );
  }

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion: any) {
  //     if (completion === 'invalid dream input') {
  //       return;
  //     }
  //     const dreamContent = json.messages[0].content;
  //     const elementList = extractDreamContent(completion, 'list') as string[];
  //     const title = `${elementList[0]} Dream`;
  //     const analysis = extractDreamContent(completion, 'analysis') as string;
  //     const theme = extractDreamContent(completion, 'theme') as string;
  //     const user = await getInfo();
  //     try {
  //       await prisma.dream.create({
  //         data: {
  //           title: title,
  //           content: dreamContent,
  //           theme: theme,
  //           analysis: analysis,
  //           keyElements: elementList,
  //           userId: user?.id || '',
  //         },
  //       });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  // });

  // return new StreamingTextResponse(stream);
}
