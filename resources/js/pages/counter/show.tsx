import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Counter } from '@/types/counter';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import CounterItemCard from './components/counter-item-card';
import CounterFormSheet from './components/counter-form-sheet';

type Props = {
  counter: Counter;
};

const ShowCounter: FC<Props> = ({ counter }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail Counter"
      description="Detail counter"
      actions={[
        backAction(),
        {
          title: 'Edit counter',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <CounterFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        counter={counter}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <CounterItemCard counter={counter} />
    </AppLayout>
  );
};

export default ShowCounter;
