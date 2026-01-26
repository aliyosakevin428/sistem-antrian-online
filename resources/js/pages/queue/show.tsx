import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Queue } from '@/types/queue';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import QueueItemCard from './components/queue-item-card';
import QueueFormSheet from './components/queue-form-sheet';

type Props = {
  queue: Queue;
};

const ShowQueue: FC<Props> = ({ queue }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail Queue"
      description="Detail queue"
      actions={[
        backAction(),
        {
          title: 'Edit queue',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <QueueFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        queue={queue}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <QueueItemCard queue={queue} />
    </AppLayout>
  );
};

export default ShowQueue;
