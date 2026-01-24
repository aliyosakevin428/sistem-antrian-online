import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { QueueSetting } from '@/types/queue_setting';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import QueueSettingItemCard from './components/queue_setting-item-card';
import QueueSettingFormSheet from './components/queue_setting-form-sheet';

type Props = {
  queue_setting: QueueSetting;
};

const ShowQueueSetting: FC<Props> = ({ queue_setting }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail QueueSetting"
      description="Detail queue_setting"
      actions={[
        backAction(),
        {
          title: 'Edit queue_setting',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <QueueSettingFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        queue_setting={queue_setting}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <QueueSettingItemCard queue_setting={queue_setting} />
    </AppLayout>
  );
};

export default ShowQueueSetting;
