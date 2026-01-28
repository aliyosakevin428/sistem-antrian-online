import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Counter } from '@/types/counter';
import { QueueCalls } from '@/types/queue_calls';
import { usePage } from '@inertiajs/react';
import DateTimeWidget from './widget/date-time-widget';
import QueueWidget from './widget/queue-widget';
import UserInfoWidget from './widget/user-info-widget';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard() {
  const {
    auth: { roles },
    counter,
    currentCall,
    waitingCount,
  } = usePage<
    SharedData & {
      counter: Counter | null;
      currentCall: QueueCalls | null;
      waitingCount: number;
    }
  >().props;

  return (
    <AppLayout title="Dashboard" description={`Selamat datang, kamu masuk sebagai ${roles.join(', ')}`} breadcrumbs={breadcrumbs}>
      <div className="grid gap-6 lg:grid-cols-2">
        <UserInfoWidget />
        <DateTimeWidget />
        {counter && <QueueWidget counter={counter} currentCall={currentCall} waitingCount={waitingCount} />}
      </div>
    </AppLayout>
  );
}
