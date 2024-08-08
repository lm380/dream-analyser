'use client';

import { Message } from 'ai';
import { useChat } from 'ai/react';
import { useCallback, useRef, useState } from 'react';
import { Card, ListCard } from './Card';
import { CardSkeleton } from './CardSkeleton';
import { extractDreamContent } from '../utils/utilityFuncs';
import { DreamRecorder } from './DreamRecorder';
import ResizingTextarea from './ResizingTextArea';

const DreamAnalyser = () => {
  const [analysis, setAnalysis] = useState<string>('');
  const [elementList, setElementList] = useState<string[]>([]);
  const chatContainer = useRef<HTMLDivElement>(null);

  let {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    setMessages,
  } = useChat({
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

  const newDreamHandler = () => {
    setAnalysis('');
    setElementList([]);
    setMessages([]);
    setInput('');
  };

  const wrappedHandleInputChange = (value: string) => {
    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const renderResponse = () => {
    return (
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={message.id} className="text-white">
            {message.role === 'user' ? (
              <p className="mb-4 bg-indigo-800 p-4 rounded-lg">
                {message.content}
              </p>
            ) : (
              <>
                {analysis ? (
                  analysis !== 'Invalid' ? (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="rounded-lg w-full md:w-1/2 border border-indigo-600">
                        <Card title={'Analysis'} value={analysis} />
                      </div>
                      <div className="rounded-lg w-full md:w-1/2 border border-indigo-600">
                        <ListCard
                          title={'Key elements'}
                          value={[...elementList]}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-red-500">
                      Oops, looks like the input was invalid
                    </p>
                  )
                ) : (
                  <CardSkeleton />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-indigo-950 pb-28 pt-8 px-4">
      <h1 className="text-4xl font-serif mb-8">Record a Dream</h1>
      <main className="flex-grow flex flex-col items-center">
        <div
          ref={chatContainer}
          className="w-full max-w-4xl flex-grow overflow-y-auto mb-8"
        >
          {renderResponse()}
        </div>
        {!messages.length && (
          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
            <div className="bg-indigo-900 rounded-lg shadow-lg border border-indigo-700 overflow-hidden">
              <div className="flex items-end p-4">
                <div className="flex-grow">
                  <ResizingTextarea
                    value={input}
                    onChange={wrappedHandleInputChange}
                    placeholder="Tell me your dream..."
                    className="w-full p-4 bg-indigo-900 text-white placeholder-indigo-300 focus:outline-none"
                    minHeight="56px"
                  />
                </div>
                <div className="flex items-center p-2">
                  <DreamRecorder updateInput={addRecording} />
                  <button
                    type="submit"
                    className="ml-2 p-2 rounded-full bg-[#fdef96] text-indigo-900 hover:bg-[#fceb6a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#fdef96]"
                    disabled={!input.trim()}
                    aria-label="Submit dream"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
        {messages.length > 0 && (
          <button
            type="button"
            onClick={newDreamHandler}
            className="mt-4 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-700"
          >
            Record new dream
          </button>
        )}
      </main>
    </div>
  );
};

export default DreamAnalyser;
