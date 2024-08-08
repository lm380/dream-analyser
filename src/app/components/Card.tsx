import { ModalProvider } from '@/contexts/ModalContext';
import { useState } from 'react';
import { ModalButton } from './ModalButton';

export function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-indigo-800 p-6 rounded-lg shadow-lg max-h-72 h-72 overflow-auto ">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`rounded px-4 py-8`}>{value}</p>
    </div>
  );
}

export function ListCard({ title, value }: { title: string; value: string[] }) {
  return (
    <div className="bg-indigo-800 p-6 rounded-lg shadow-lg max-h-72 h-72 overflow-auto ">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <ol className={`rounded px-4 py-8`}>
        {[...value].map((element, index) => (
          <li key={index}>{element}</li>
        ))}
      </ol>
    </div>
  );
}

export function DreamCard({
  title,
  content,
  analysis,
  keyElements,
}: {
  title: string;
  content: string;
  analysis: string;
  keyElements: string[];
}) {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <div className="bg-indigo-800 p-6 rounded-lg shadow-lg max-h-72 min-h-72 overflow-auto">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      <p>{content.substring(0, 100)}...</p>

      <ModalProvider>
        <ModalButton
          styles="text-purple-300 mt-2"
          buttonText={expanded ? 'Show Less' : 'Show More'}
          wrapperBackground="bg-indigo-800"
        >
          <>
            <div className="bg-indigo-800 p-6 rounded-lg max-h-96 min-h-72 overflow-auto">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <h2 className="mt-2 text-lg">Dream Content</h2>
              <span className={`rounded py-8`}>{content.trim()}</span>

              <h2 className="mt-2 text-lg">Given Analysis</h2>
              <span className={`rounded py-8`}>{analysis.trim()}</span>

              <h2 className="mt-2 text-lg">Key Elements in Dream</h2>
              <ol className={`rounded px-4`}>
                {[...keyElements].map((element, index) => (
                  <li key={index}>{element}</li>
                ))}
              </ol>
            </div>
          </>
        </ModalButton>
      </ModalProvider>
    </div>
  );
}
