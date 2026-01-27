import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { QueueCalls } from '@/types/queue_calls';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue_callsIds: QueueCalls['id'][];
  onSuccess?: () => void;
};

const QueueCallsBulkEditSheet: FC<Props> = ({ children, queue_callsIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    queue_calls_ids: queue_callsIds,
  });

  useEffect(() => {
    setData('queue_calls_ids', queue_callsIds);
  }, [queue_callsIds, setData]);

  const handleSubmit = () => {
    put(route('queue_calls.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('QueueCalls updated successfully');
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
          <SheetTitle>Ubah queue_calls</SheetTitle>
          <SheetDescription>Ubah data {data.queue_calls_ids.length} queue_calls</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan queue_calls`} loading={processing} disabled={processing} />
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

export default QueueCallsBulkEditSheet;
