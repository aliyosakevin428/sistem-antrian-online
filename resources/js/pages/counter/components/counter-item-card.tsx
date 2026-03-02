import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { Counter } from '@/types/counter';
import { FC } from 'react';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

type Props = {
  counter: Counter;
  className?: string;
};

const CounterItemCard: FC<Props> = ({ counter, className }) => {
  const total = counter.waiting + counter.today_served;

  const progress = total > 0 ? Math.round((counter.today_served / total) * 100) : 0;

  const chartData = [
    {
      name: 'progress',
      value: progress,
      fill: 'var(--primary)',
    },
  ];

  const chartConfig = {
    value: {
      label: 'Progress',
    },
    progress: {
      label: 'Progress',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{counter.name}</CardTitle>
        <CardDescription>Berikut adalah data performa {counter.name}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-6">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={chartData} endAngle={360} innerRadius={80} outerRadius={140}>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[86, 74]} />

            <RadialBar dataKey="value" background cornerRadius={10} />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                          {progress}%
                        </tspan>

                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                          Progress Hari Ini
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Antrian</p>
            <p className="text-xl font-bold">{counter.waiting}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Dilayani</p>
            <p className="text-xl font-bold">{counter.today_served}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterItemCard;
