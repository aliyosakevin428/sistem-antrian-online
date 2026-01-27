import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { QueueCalls } from '@/types/queue_calls';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import QueueCallsItemCard from './components/queue_calls-item-card';
import QueueCallsFormSheet from './components/queue_calls-form-sheet';

type Props = {
  queue_calls: QueueCalls;
};

const ShowQueueCalls: FC<Props> = ({ queue_calls }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail QueueCalls"
      description="Detail queue_calls"
      actions={[
        backAction(),
        {
          title: 'Edit queue_calls',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <QueueCallsFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        queue_calls={queue_calls}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <QueueCallsItemCard queue_calls={queue_calls} />
    </AppLayout>
  );
};

export default ShowQueueCalls;
