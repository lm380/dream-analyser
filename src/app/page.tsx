import OpenAI from 'openai';
import { ChatCompletion } from 'openai/src/resources/chat/completions.js';
import { ChangeEvent, useState, MouseEvent } from 'react';
import DreamAnalyser from './components/dreamAnalyser';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <DreamAnalyser />
      </div>
    </main>
  );
}
