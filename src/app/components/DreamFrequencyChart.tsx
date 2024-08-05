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
  function getDateRange(dreams: Dream[]) {
    if (dreams.length === 0)
      return { start: new Date(), end: new Date(), days: 0 };

    const start = new Date(dreams[0].created_at);
    const end = new Date(dreams[dreams.length - 1].created_at);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
    );
    return { start, end, days };
  }

  function generateChartData(
    dreams: Dream[],
    dateRange: { start: Date; end: Date; days: number }
  ) {
    let labels: string[] = [];
    let data: number[] = [];

    if (dateRange.days <= 7) {
      // Daily for a week or less
      for (let i = 0; i <= dateRange.days; i++) {
        const date = new Date(
          dateRange.start.getTime() + i * 24 * 60 * 60 * 1000
        );
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));

        data.push(
          dreams.filter(
            (d) => new Date(d.created_at).toDateString() === date.toDateString()
          ).length
        );
      }
    } else if (dateRange.days <= 30) {
      // Weekly for a month or less
      const weeks = Math.ceil(dateRange.days / 7);
      for (let i = 0; i < weeks; i++) {
        const weekStart = new Date(
          dateRange.start.getTime() + i * 7 * 24 * 60 * 60 * 1000
        );
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        labels.push(`Week ${i + 1}`);
        data.push(
          dreams.filter(
            (d) => d.created_at >= weekStart && d.created_at <= weekEnd
          ).length
        );
      }
    } else {
      // Monthly for more than a month
      const months = Math.ceil(dateRange.days / 30);
      for (let i = 0; i < months; i++) {
        const monthStart = new Date(
          dateRange.start.getFullYear(),
          dateRange.start.getMonth() + i,
          1
        );
        const monthEnd = new Date(
          dateRange.start.getFullYear(),
          dateRange.start.getMonth() + i + 1,
          0
        );
        labels.push(monthStart.toLocaleDateString('en-US', { month: 'short' }));
        data.push(
          dreams.filter(
            (d) => d.created_at >= monthStart && d.created_at <= monthEnd
          ).length
        );
      }
    }

    return { labels, data };
  }

  const chartData = useMemo(() => {
    const dateRange = getDateRange(dreams);
    const { labels, data } = generateChartData(dreams, dateRange);

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
      <h3>Dream Frequency</h3>
      <Line data={chartData} />
    </div>
  );
};
