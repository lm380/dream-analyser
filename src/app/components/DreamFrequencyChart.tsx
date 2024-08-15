'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useMemo } from 'react';
import { Dream } from '@prisma/client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const DreamFrequencyChart = ({ dreams }: { dreams: Dream[] }) => {
  // Helper function to get the date 7 days ago
  const get7DaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  };

  const filterDreamsInLast7Days = (dreams: Dream[]) => {
    const sevenDaysAgo = get7DaysAgo();
    return dreams.filter((dream) => new Date(dream.created_at) >= sevenDaysAgo);
  };

  const generateChartData = (filteredDreams: Dream[]) => {
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.unshift(date.toLocaleDateString('en-US', { weekday: 'short' }));

      const dailyCount = filteredDreams.filter(
        (dream) =>
          new Date(dream.created_at).toDateString() === date.toDateString()
      ).length;
      data.unshift(dailyCount);
    }

    return { labels, data };
  };

  const chartData = useMemo(() => {
    const filteredDreams = filterDreamsInLast7Days(dreams);
    const { labels, data } = generateChartData(filteredDreams);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Dreams Recorded',
          data: data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [dreams]);

  if (dreams.length === 0) return <div>No dreams recorded yet.</div>;

  return (
    <div className="w-1/2">
      <h3>Dream Frequency (Last 7 Days)</h3>
      <Line data={chartData} />
    </div>
  );
};
