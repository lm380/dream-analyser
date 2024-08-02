'use client';

import { Dream } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';
import { ListEntry } from 'wordcloud';

// Import WordCloud dynamically
const WordCloud = typeof window !== 'undefined' ? require('wordcloud') : null;

export const WordCloudComponent = ({ dreams }: { dreams: Dream[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract themes and create frequency map
  const dreamThemes = dreams.map((d) => d.theme);
  const dreamThemeFreqMap = new Map<string, number>();

  dreamThemes.forEach((theme) => {
    dreamThemeFreqMap.set(theme, (dreamThemeFreqMap.get(theme) || 0) + 1);
  });

  const sortedDreamMap = new Map(
    [...dreamThemeFreqMap.entries()].sort((a, b) => b[1] - a[1])
  );

  const wordCloudData: ListEntry[] = Array.from(
    sortedDreamMap,
    ([text, value]): ListEntry => [text, value]
  ).slice(0, 10);

  useEffect(() => {
    if (isClient && canvasRef.current && WordCloud) {
      // Debugging logs
      console.log('Initializing word cloud with data:', wordCloudData);

      WordCloud(canvasRef.current, {
        list: wordCloudData,
        gridSize: Math.round(16 * (500 / 1024)),
        weightFactor: function (size: number) {
          return Math.pow(size, 2.3) * (500 / 1024);
        },
        fontFamily: 'Times, serif',
        color: function () {
          return ['#f02222', '#c09292', '#d3d3d3', '#f472d0'][
            Math.floor(Math.random() * 4)
          ];
        },
        rotateRatio: 0.5,
        rotationSteps: 2,
        backgroundColor: '#333',
        drawOutOfBound: false,
      });
    }
  }, [isClient, wordCloudData]);

  if (!isClient) return null; // Render nothing or a loading spinner while client-side is not ready

  return <canvas ref={canvasRef} width={500} height={500}></canvas>;
};
