import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Counter } from '@/types/counter';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState } from 'react';

interface Props {
  counter: Counter;
}

export default function CounterStatusWidget({ counter }: Props) {
  const [processing, setProcessing] = useState(false);

  const toggleStatus = () => {
    setProcessing(true);

    router.patch(
      route('counter.toggle_status', counter.id),
      {},
      {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => setProcessing(false),
      },
    );
  };

  const breakDuration =
    !counter.is_active && counter.break_started_at ? Math.floor((new Date().getTime() - new Date(counter.break_started_at).getTime()) / 60000) : 0;

  const progress = Math.min((counter.today_served / 50) * 100, 100);

  return (
    <Card className="rounded-2xl border bg-background shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">{counter.name}</CardTitle>
          <p className="text-sm text-muted-foreground">Status operasional loket</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={counter.is_active ? 'default' : 'destructive'} className="px-3 py-1">
            {counter.is_active ? 'Active' : 'Break'}
          </Badge>

          <Switch checked={counter.is_active} onCheckedChange={toggleStatus} disabled={processing} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="relative overflow-hidden rounded-xl bg-muted/40 p-4 text-center">
          {counter.is_active && <div className="absolute inset-0 animate-pulse bg-green-500/5" />}

          <p className="text-xs text-muted-foreground">Status Operasional</p>

          <p className="text-2xl font-bold">{counter.is_active ? 'Sedang Beroperasi' : 'Sedang Istirahat'}</p>

          {counter.is_active && counter.operational_started_at && (
            <p className="mt-1 text-xs text-muted-foreground">
              Beroperasi sejak {format(new Date(counter.operational_started_at), 'HH:mm', { locale: id })}
            </p>
          )}

          {!counter.is_active && counter.break_started_at && <p className="mt-1 text-xs text-destructive">Istirahat {breakDuration} menit</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Produktivitas Hari Ini</span>
            <span>{counter.today_served} antrian</span>
          </div>

          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
