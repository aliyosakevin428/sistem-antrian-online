import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { em } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue_callsIds: number[];
  onSuccess?: () => void;
};

const QueueCallsBulkDeleteDialog: FC<Props> = ({ children, queue_callsIds, onSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (!queue_callsIds.length) {
      toast.error('Tidak ada data yang dipilih');
      return;
    }

    router.delete(route('queue_calls.bulk.destroy'), {
      data: { queue_calls_ids: queue_callsIds },
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Queue calls deleted successfully');
        setOpen(false);
        onSuccess?.();
      },
      onError: (e) => toast.error(em(e)),
    });
  };


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete selected queue_calls and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            <Trash2 />
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QueueCallsBulkDeleteDialog;
