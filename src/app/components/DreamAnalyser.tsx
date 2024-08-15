'use client';

import { useState } from 'react';
import { Card, ListCard } from './Card';
import { CardSkeleton } from './CardSkeleton';
import ResizingTextarea from './ResizingTextArea';
import { DreamRecorder } from './DreamRecorder';
import { RateLimit } from '@prisma/client';

interface DreamAnalyserProps {
  rateLimitInfo?: RateLimit | null;
}

const DreamAnalyser = ({ rateLimitInfo }: DreamAnalyserProps) => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [elementList, setElementList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [tokensLeft, setTokensLeft] = useState(
    100 - (rateLimitInfo?.count || 0)
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [{ content: input, role: 'user' }] }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const result = await response.json();

      setTokensLeft((prev) => prev - 1);
      if (result.content === 'invalid dream input') {
        setAnalysis('Invalid');
      } else {
        setElementList(result.elementList);
        setAnalysis(result.analysis);
      }
    } catch (error) {
      setError('An error occurred while processing your dream.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    handleSubmit({ preventDefault: () => {} });
  };

  const addRecording = (recordedText: any) => {
    setInput((prevInput) => `${prevInput} ${recordedText}`);
  };

  const newDreamHandler = () => {
    setAnalysis('');
    setInput('');
    setElementList([]);
  };

  return (
    <div className="flex flex-col min-h-[90vh] w-full bg-indigo-950 pb-8 pt-8 px-4">
      <p className="self-end">Tokens left for the month: {tokensLeft}/100</p>
      <h1 className="text-4xl font-serif mb-8">Record a Dream</h1>
      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-4xl flex-grow overflow-y-auto mb-8">
          {loading ? (
            <CardSkeleton />
          ) : (
            <div className="space-y-4">
              {analysis && analysis !== 'Invalid' ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="rounded-lg w-full md:w-1/2 border border-indigo-600">
                    <Card title={'Analysis'} value={analysis} />
                  </div>
                  <div className="rounded-lg w-full md:w-1/2 border border-indigo-600">
                    <ListCard title={'Key elements'} value={[...elementList]} />
                  </div>
                </div>
              ) : (
                <>
                  {error && <div className="text-red-500">{error}</div>}
                  {analysis === 'Invalid' && (
                    <p className="text-red-500">
                      Invalid input, please try again.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {!analysis && (
          <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
            <div className="bg-indigo-900 rounded-lg shadow-lg border border-indigo-700 overflow-hidden">
              <div className="flex items-end p-4">
                <div className="flex-grow">
                  <ResizingTextarea
                    value={input}
                    onChange={(e) => setInput(e)}
                    placeholder="Tell me your dream..."
                    className="w-full p-4 bg-indigo-900 text-white placeholder-indigo-300 focus:outline-none"
                    minHeight="56px"
                  />
                </div>
                <div className="flex items-baseline p-2">
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
        {analysis && (
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
