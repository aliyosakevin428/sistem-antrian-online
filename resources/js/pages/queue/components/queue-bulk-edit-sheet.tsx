import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Queue } from '@/types/queue';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queueIds: Queue['id'][];
  onSuccess?: () => void;
};

const QueueBulkEditSheet: FC<Props> = ({ children, queueIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    queue_ids: queueIds,
  });

  useEffect(() => {
    setData('queue_ids', queueIds);
  }, [queueIds, setData]);

  const handleSubmit = () => {
    put(route('queue.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Queue updated successfully');
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
          <SheetTitle>Ubah queue</SheetTitle>
          <SheetDescription>Ubah data {data.queue_ids.length} queue</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan queue`} loading={processing} disabled={processing} />
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

export default QueueBulkEditSheet;
