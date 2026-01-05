'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Trend } from '../lib/api';

interface TrendCardProps {
  trend: Trend;
  index: number;
}

export default function TrendCard({ trend, index }: TrendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        rotateY: 5,
        rotateX: 5,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl border border-slate-700 hover:border-cyan-500/50 transition-all duration-300"
      style={{ willChange: 'transform' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {trend.title}
            </h3>
            <p className="text-sm text-slate-300 line-clamp-3 mb-3">
              {trend.description}
            </p>
          </div>
          {trend.imageUrl && (
            <div className="ml-4 flex-shrink-0">
              <Image
                src={trend.imageUrl}
                alt={trend.title}
                width={60}
                height={60}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-cyan-400">🔥</span>
              <span className="text-white font-medium">{trend.searchVolume.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-rose-400">📈</span>
              <span className="text-white font-medium">{trend.growthRate}%</span>
            </div>
          </div>
          {trend.isHot && (
            <span className="px-2 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-full border border-rose-500/30">
              HOT
            </span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400">{trend.category}</p>
        </div>
      </div>
    </motion.div>
  );
}
