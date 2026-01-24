import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Service } from '@/types/service';
import { Edit } from 'lucide-react';
import { FC, useState } from 'react';
import { SharedData } from '@/types';
import { Link, usePage, router} from '@inertiajs/react';
import { backAction } from '@/lib/utils';
import ServiceItemCard from './components/service-item-card';
import ServiceFormSheet from './components/service-form-sheet';

type Props = {
  service: Service;
};

const ShowService: FC<Props> = ({ service }) => {
  // const { permissions } = usePage<SharedData>().props;
  const [openEditSheet, setOpenEditSheet] = useState(false);

  return (
    <AppLayout
      title="Detail Service"
      description="Detail service"
      actions={[
        backAction(),
        {
          title: 'Edit service',
          onClick: () => setOpenEditSheet(true),
          icon: Edit,
        },
      ]}
    >
      <ServiceFormSheet
        open={openEditSheet}
        onOpenChange={setOpenEditSheet}
        purpose="edit"
        service={service}
        onSuccess={() => setOpenEditSheet(false)}
        withChildren={false}
      />
      <ServiceItemCard service={service} />
    </AppLayout>
  );
};

export default ShowService;
