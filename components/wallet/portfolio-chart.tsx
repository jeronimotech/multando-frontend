'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface PortfolioDataPoint {
  date: string;
  balance: number;
}

interface PortfolioChartProps {
  data: PortfolioDataPoint[];
  className?: string;
}

// Mock data if none provided
const DEFAULT_DATA: PortfolioDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  balance: 200 + Math.random() * 150 + i * 5,
}));

export function PortfolioChart({ data = DEFAULT_DATA, className }: PortfolioChartProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('wallet_components.portfolio_value')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b5eef" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#3b5eef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [`${value.toFixed(2)} MULTA`, 'Balance']}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3b5eef"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
