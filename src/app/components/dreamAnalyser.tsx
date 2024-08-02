'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, ListCard } from './Card';
import { CardSkeleton } from './CardSkeleton';
import { extractDreamContent } from '../utils/utilityFuncs';
import { DreamRecorder } from './DreamRecorder';
import { User } from '@prisma/client';

type DreamAnalyserProps = {
  user?: User | null;
};

const DreamAnalyser = ({ user }: DreamAnalyserProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [elementList, setElementList] = useState<string[]>([]);
  const chatContainer = useRef<HTMLDivElement>(null);

  let { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    api: '/api/chat',
    onFinish: (message: Message) => {
      const { content } = message;

      if (content === 'invalid dream input') {
        setAnalysis('Invalid');
      } else {
        const extractedList = extractDreamContent(content, 'list') as string[];
        const newAnalysis = extractDreamContent(content, 'analysis') as string;

        setElementList(extractedList);
        setAnalysis(newAnalysis);
      }
    },
  });

  const addRecording = useCallback(
    (recordedText: string) => {
      setInput((prevInput) => `${prevInput} ${recordedText}`);
    },
    [setInput]
  );

  const renderResponse = () => {
    return (
      <div>
        {messages.map((message, index) => (
          <div key={message.id} className={`text-white`}>
            <div className="w-full ml-[16px]">
              {message.role === 'user' ? (
                <p className="mb-6">{message.content}</p>
              ) : (
                <>
                  {analysis ? (
                    analysis !== 'Invalid' ? (
                      <div className="flex gap-4 flex-row max-w-full">
                        <div className="rounded-lg w-1/2 border border-gray-600">
                          <Card title={'Analysis'} value={analysis} />
                        </div>
                        <div className="rounded-lg w-1/2 border border-gray-600">
                          <ListCard
                            title={'Key elements'}
                            value={[...elementList]}
                          />
                        </div>
                      </div>
                    ) : (
                      <>Oops looks like the input was invalid</>
                    )
                  ) : (
                    <CardSkeleton />
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div ref={chatContainer} className="chat">
      {renderResponse()}
      {!messages.length && (
        <form
          onSubmit={handleSubmit}
          className={'w-4/5 absolute right-0 left-[18%] bottom-[2%]'}
        >
          <textarea
            name="input-field"
            placeholder="tell me your dream"
            onChange={handleInputChange}
            value={input}
            className={'p-2 rounded-md w-4/5'}
          />
          <DreamRecorder updateInput={addRecording} />
          <button
            type="submit"
            className={
              'w-1/8 p-2 rounded-md bg-[#fdef96] ml-[3%] text-gray-400'
            }
          >
            submit
          </button>
        </form>
      )}
    </div>
  );
};

export default DreamAnalyser;
