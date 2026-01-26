import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose, Item } from '@/types';
import { Queue } from '@/types/queue';
import { useForm, usePage } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue?: Queue;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const QueueFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  queue,
  purpose,
  variant = 'default',
  icon: Icon,
  buttonLabel,
  onSuccess,
  open,
  onOpenChange,
  withChildren = true,
}) => {

  // const { items = [] } = usePage<{ items: Item[] }>().props;

  const { data, setData, put, post, processing } = useForm({
    service_id : queue?.service_id ?? '',
queue_number : queue?.queue_number ?? '',
status : queue?.status ?? '',
queue_date : queue?.queue_date ?? '',

  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('queue.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('queue.update', queue?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User updated successfully');
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {withChildren && (
        <>
          {children ? (
            <SheetTrigger asChild>{children}</SheetTrigger>
          ) : (
            <SheetTrigger asChild>
              <Button variant={variant == 'default' ? 'default' : 'ghost'} size={variant == 'default' ? 'default' : 'icon'}>
                {Icon ? <Icon /> : purpose == 'create' ? <PlusSquare /> : purpose == 'edit' ? <Edit /> : <Copy />}
                {variant == 'default' && buttonLabel}
              </Button>
            </SheetTrigger>
          )}
        </>
      )}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{capitalizeWords(purpose)} data queue</SheetTitle>
          <SheetDescription>Form untuk {purpose} data queue</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
                <FormControl label="Service Id">
        <Select value={data.service_id.toString()} onValueChange={(value) => setData('service_id', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Pilih Service Id" />
            </SelectTrigger>
            <SelectContent>
                {/* {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                ))}  */}
                <SelectItem value={data.service_id.toString()}>{data.service_id}</SelectItem>
            </SelectContent>
        </Select>
    </FormControl>
    <FormControl label="Queue Number">
        <Input type="text" placeholder="Enter Queue Number" value={data.queue_number} onChange={(e) => setData('queue_number', e.target.value)} />
    </FormControl>
    <FormControl label="Status">
        <Input type="text" placeholder="Enter Status" value={data.status} onChange={(e) => setData('status', e.target.value)} />
    </FormControl>
    <FormControl label="Queue Date">
        <Input type="text" placeholder="Enter Queue Date" value={data.queue_date} onChange={(e) => setData('queue_date', e.target.value)} />
    </FormControl>
          </form>
        </ScrollArea>
        <SheetFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} queue`} loading={processing} disabled={processing} />
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

export default QueueFormSheet;
