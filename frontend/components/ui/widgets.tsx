'use client';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface DistributionChartProps {
  title: string;
  data: ChartData[];
  variant?: 'pie' | 'bar' | 'donut';
}

export function DistributionChart({
  title,
  data,
  variant = 'bar',
}: DistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
  ];

  if (variant === 'bar') {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  <span className="text-xs text-muted-foreground">({item.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors[idx % colors.length]}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, idx) => {
                const startAngle =
                  data
                    .slice(0, idx)
                    .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0) * (Math.PI / 180);
                const arcAngle = (item.percentage / 100) * 360 * (Math.PI / 180);
                const radius = 30;
                const x1 = 50 + radius * Math.cos(startAngle);
                const y1 = 50 + radius * Math.sin(startAngle);
                const x2 = 50 + radius * Math.cos(startAngle + arcAngle);
                const y2 = 50 + radius * Math.sin(startAngle + arcAngle);
                const largeArc = item.percentage > 50 ? 1 : 0;

                return (
                  <path
                    key={idx}
                    d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={
                      ['#7c3aed', '#06b6d4', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'][
                        idx % 6
                      ]
                    }
                    className="opacity-80"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#7c3aed', '#06b6d4', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'][
                    idx % 6
                  ],
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.value} ({item.percentage.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimeSeriesData {
  label: string;
  value: number;
}

interface TimeSeriesChartProps {
  title: string;
  data: TimeSeriesData[];
  yAxisLabel?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function TimeSeriesChart({
  title,
  data,
  valuePrefix = '',
  valueSuffix = '',
}: TimeSeriesChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((item, idx) => {
            const normalized = (item.value - minValue) / range;
            const height = Math.max(normalized * 100, 5);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${height}%` }}
                  title={`${valuePrefix}${item.value}${valueSuffix}`}
                />
                <span className="text-xs text-muted-foreground text-center truncate w-full px-1">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {data.map((item, idx) => (
              <div key={idx}>
                <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                <p className="font-semibold text-foreground">
                  {valuePrefix}
                  {item.value}
                  {valueSuffix}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
