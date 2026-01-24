import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { QueueSetting } from '@/types/queue_setting';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue_settingIds: QueueSetting['id'][];
  onSuccess?: () => void;
};

const QueueSettingBulkEditSheet: FC<Props> = ({ children, queue_settingIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    queue_setting_ids: queue_settingIds,
  });

  useEffect(() => {
    setData('queue_setting_ids', queue_settingIds);
  }, [queue_settingIds, setData]);

  const handleSubmit = () => {
    put(route('queue_setting.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('QueueSetting updated successfully');
        onSuccess?.();
      },
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ubah queue_setting</SheetTitle>
          <SheetDescription>Ubah data {data.queue_setting_ids.length} queue_setting</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan queue_setting`} loading={processing} disabled={processing} />
          <SheetClose asChild>
            <Button variant={'outline'}>
              <X /> Batalin
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default QueueSettingBulkEditSheet;
