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
import { QueueSetting } from '@/types/queue_setting';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FC, PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue_setting: QueueSetting;
};

const QueueSettingDeleteDialog: FC<Props> = ({ children, queue_setting }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    router.delete(route('queue-setting.destroy', queue_setting.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('QueueSetting deleted successfully');
        setOpen(false);
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
            This action cannot be undone. This will permanently delete queue_setting and remove your data from our servers.
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

export default QueueSettingDeleteDialog;
