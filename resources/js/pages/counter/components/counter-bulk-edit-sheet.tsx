import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Counter } from '@/types/counter';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  counterIds: Counter['id'][];
  onSuccess?: () => void;
};

const CounterBulkEditSheet: FC<Props> = ({ children, counterIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    counter_ids: counterIds,
  });

  useEffect(() => {
    setData('counter_ids', counterIds);
  }, [counterIds, setData]);

  const handleSubmit = () => {
    put(route('counter.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Counter updated successfully');
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
          <SheetTitle>Ubah counter</SheetTitle>
          <SheetDescription>Ubah data {data.counter_ids.length} counter</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan counter`} loading={processing} disabled={processing} />
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

export default CounterBulkEditSheet;
