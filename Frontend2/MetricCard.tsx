import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { MetricCard as MetricCardType } from '@/types';

interface Props {
  metric: MetricCardType;
}

export default function MetricCard({ metric }: Props) {
  const colorClasses = {
    success: 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950',
    warning: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950',
    error: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
    info: 'border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950',
  };

  const textColorClasses = {
    success: 'text-green-700 dark:text-green-300',
    warning: 'text-amber-700 dark:text-amber-300',
    error: 'text-red-700 dark:text-red-300',
    info: 'text-blue-700 dark:text-blue-300',
  };

  const iconColorClasses = {
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  const color = metric.color || 'info';
  const trend = metric.trend || 'stable';

  return (
    <div className={`rounded-lg border p-4 transition-all hover:shadow-md hover:scale-105 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={`text-2xl font-bold ${textColorClasses[color]}`}>
              {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
            </p>
            {metric.unit && <span className="text-sm text-gray-500 dark:text-gray-400">{metric.unit}</span>}
          </div>
          {metric.change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />}
              <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend === 'up' ? '+' : ''}{metric.change}%
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-full p-2 ${iconColorClasses[color]}`}>
          {color === 'success' && <CheckCircle className="h-6 w-6" />}
          {color === 'warning' && <AlertCircle className="h-6 w-6" />}
          {color === 'error' && <AlertCircle className="h-6 w-6" />}
          {color === 'info' && <CheckCircle className="h-6 w-6" />}
        </div>
      </div>
    </div>
  );
}
