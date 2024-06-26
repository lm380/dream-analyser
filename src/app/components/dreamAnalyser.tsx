'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { Card, ListCard } from './card';
import { CardSkeleton } from './skeleton';
import { extractDreamContent } from '../utils/utilityfuncs';

const DreamAnalyser = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [elementList, setElementList] = useState<string[]>([]);
  const chatContainer = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onFinish: (message: Message) => {
      const { content } = message;

      const extractedList = extractDreamContent(content, 'list') as string[];
      const newAnalysis = extractDreamContent(content, 'analysis') as string;

      setElementList(extractedList);
      setAnalysis(newAnalysis);
    },
  });

  const scroll = () => {
    const { offsetHeight, scrollHeight, scrollTop } =
      chatContainer.current as HTMLDivElement;
    if (scrollHeight >= scrollTop + offsetHeight) {
      chatContainer.current?.scrollTo(0, scrollHeight + 200);
    }
  };

  useEffect(() => {
    scroll();
  }, [messages]);

  const renderResponse = () => {
    return (
      <div className="response">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`chat-line ${
              message.role === 'user' ? 'user-chat' : 'ai-chat'
            } text-white`}
          >
            {/* create image component here*/}
            <div style={{ width: '100%', marginLeft: '16px' }}>
              {message.role === 'user' ? (
                <p className="mb-6">{message.content}</p>
              ) : (
                <>
                  {analysis ? (
                    <div className="flex gap-4 flex-row max-w-full">
                      <div className="rounded w-1/2 border border-gray-600">
                        <Card title={'Analysis'} value={analysis} />
                      </div>
                      <div className="rounded w-1/2 border border-gray-600">
                        <ListCard
                          title={'Key elements'}
                          value={[...elementList]}
                        />
                      </div>
                    </div>
                  ) : (
                    <CardSkeleton />
                  )}
                </>
              )}
              {index < messages.length - 1 && (
                <div className="horizontal-line" />
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
          className={'w-4/5 absolute right-0 left-[10%] bottom-[2%]'}
        >
          <input
            name="input-field"
            type="text"
            placeholder="tell me your dream"
            onChange={handleInputChange}
            value={input}
            className={'p-2 rounded-md w-4/5'}
          />
          <button
            type="submit"
            className={'w-1/6 p-2 rounded-md bg-[#fdef96] ml-[3%]'}
          >
            submit
          </button>
        </form>
      )}
    </div>
  );
};

export default DreamAnalyser;
