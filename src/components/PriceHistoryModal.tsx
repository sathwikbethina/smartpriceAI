import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/formatters';
import { PriceHistoryData } from '../types';
import { X, TrendingDown, TrendingUp, CheckCircle, AlertTriangle, Calendar, Info } from 'lucide-react';
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

export const PriceHistoryModal: React.FC = () => {
  const { selectedProductForHistory, setSelectedProductForHistory, darkMode } = useApp();

  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('90');
  const [historyData, setHistoryData] = useState<PriceHistoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProductForHistory) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const query = encodeURIComponent(selectedProductForHistory.name);
        const basePrice = selectedProductForHistory.price;
        const res = await fetch(`/api/price-history?query=${query}&basePrice=${basePrice}`);
        if (res.ok) {
          const data = await res.json();
          setHistoryData(data);
        }
      } catch (err) {
        console.error('Error fetching price history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedProductForHistory]);

  if (!selectedProductForHistory) return null;

  const product = selectedProductForHistory;

  // Filter timeline slice according to selected range
  const rawTimeline = historyData?.timeline || [];
  const count = timeRange === '30' ? 10 : timeRange === '90' ? 30 : rawTimeline.length;
  const filteredTimeline = rawTimeline.slice(-count);

  const labels = filteredTimeline.map((p) => p.date);
  const amazonPrices = filteredTimeline.map((p) => p.amazon);
  const blinkitPrices = filteredTimeline.map((p) => p.blinkit);
  const flipkartPrices = filteredTimeline.map((p) => p.flipkart);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Amazon India',
        data: amazonPrices,
        borderColor: '#1A56DB', // Blue
        backgroundColor: 'rgba(26, 86, 219, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
      },
      {
        label: 'Blinkit',
        data: blinkitPrices,
        borderColor: '#EAB308', // Yellow
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
      },
      {
        label: 'Flipkart',
        data: flipkartPrices,
        borderColor: '#FF5A1F', // Orange
        backgroundColor: 'rgba(255, 90, 31, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: darkMode ? '#cbd5e1' : '#475569',
          boxWidth: 10,
          font: { size: 11, weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${formatINR(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 },
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#94a3b8' : '#64748b',
          font: { size: 10 },
          callback: (value: any) => `₹${value}`,
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E2130] w-full max-w-xl rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-left relative my-6">
        <button
          onClick={() => setSelectedProductForHistory(null)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-8">
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Multi-Store Price Analytics
          </span>
          <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Current Lowest: <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(product.price)}</strong> across Indian retailers
          </p>
        </div>

        {/* Recommendation Banner */}
        {historyData && (
          <div
            className={`p-3.5 rounded-2xl mb-4 flex items-center gap-3 border ${
              historyData.isGoodTimeToBuy
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            {historyData.isGoodTimeToBuy ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div className="text-xs">
              <p className="font-black text-sm">
                {historyData.isGoodTimeToBuy ? 'Good Time to Buy! ⚡' : 'Wait for Better Deal ⏳'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">{historyData.recommendation}</p>
            </div>
          </div>
        )}

        {/* Range Tabs */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900/60 p-1 rounded-2xl mb-4">
          <button
            onClick={() => setTimeRange('30')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeRange === '30'
                ? 'bg-white dark:bg-[#1E2130] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeRange === '90'
                ? 'bg-white dark:bg-[#1E2130] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => setTimeRange('365')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              timeRange === '365'
                ? 'bg-white dark:bg-[#1E2130] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past 1 Year
          </button>
        </div>

        {/* Chart View */}
        <div className="h-64 w-full bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 mb-4">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Loading price history timeline...
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>

        {/* Stats Cards */}
        {historyData && (
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Lowest Ever
              </span>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {formatINR(historyData.lowestEver)}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Highest Ever
              </span>
              <p className="text-sm font-black text-rose-500 dark:text-rose-400 mt-0.5">
                {formatINR(historyData.highestEver)}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
                Average Price
              </span>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">
                {formatINR(historyData.averagePrice)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
