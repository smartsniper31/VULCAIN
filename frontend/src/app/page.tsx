'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchTrends, Trend } from '../lib/api';
import TrendCard from '../components/TrendCard';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trends'],
    queryFn: () => fetchTrends(1, 20),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center aero-dark-bg">
        <div className="text-white text-xl">Forging trends...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center aero-dark-bg">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Forge temporarily cooled</div>
          <div className="text-slate-400">Reconnecting...</div>
        </div>
      </div>
    );
  }

  const trends = data?.data || [];

  return (
    <div className="min-h-screen aero-dark-bg py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            VULCAIN Trend Intelligence
          </h1>
          <p className="text-slate-300 text-lg">
            Real-time insights from the digital forge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trends.map((trend: Trend, index: number) => (
            <TrendCard key={trend.id} trend={trend} index={index} />
          ))}
        </div>

        {trends.length === 0 && (
          <div className="text-center text-slate-400 mt-12">
            No trends available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
