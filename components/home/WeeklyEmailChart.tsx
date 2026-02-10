"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EmailStat {
  day: string;
  total_message: number;
  attachment_count: number;
  unique_contrib_count: number;
}

export function WeeklyEmailChart() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<EmailStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/email-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching email stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Format dates for display
  const labels = stats.map(stat => {
    const date = new Date(stat.day);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  });

  // Extract data for the chart
  const emailData = stats.map(stat => stat.total_message);
  const patchData = stats.map(stat => stat.attachment_count);
  const contributorData = stats.map(stat => stat.unique_contrib_count);

  const data = {
    labels,
    datasets: [
      {
        label: t(trans.homePage.emailsLabel),
        data: emailData,
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
      {
        label: t(trans.homePage.patchesLabel),
        data: patchData,
        borderColor: 'rgb(168, 85, 247)', // purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(168, 85, 247)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
      {
        label: t(trans.homePage.contributorsLabel),
        data: contributorData,
        borderColor: 'rgb(34, 197, 94)', // green-500
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(34, 197, 94)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
    },
  };

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {t(trans.homePage.weeklyEmailActivity)}
      </h3>
      <div className="h-[280px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500 dark:text-slate-400">Loading...</div>
          </div>
        ) : stats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-slate-500 dark:text-slate-400">No data available</div>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
}
