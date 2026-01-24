import { Button } from '@/components/ui/button';
import SubmitButton from '@/components/submit-button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { em } from '@/lib/utils';
import { Service } from '@/types/service';
import { useForm } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  serviceIds: Service['id'][];
  onSuccess?: () => void;
};

const ServiceBulkEditSheet: FC<Props> = ({ children, serviceIds, onSuccess }) => {
  const { data, setData, put, processing } = useForm({
    service_ids: serviceIds,
  });

  useEffect(() => {
    setData('service_ids', serviceIds);
  }, [serviceIds, setData]);

  const handleSubmit = () => {
    put(route('service.bulk.update'), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Service updated successfully');
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
          <SheetTitle>Ubah service</SheetTitle>
          <SheetDescription>Ubah data {data.service_ids.length} service</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SubmitButton icon={Check} onClick={handleSubmit} label={`Simpan service`} loading={processing} disabled={processing} />
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

export default ServiceBulkEditSheet;
