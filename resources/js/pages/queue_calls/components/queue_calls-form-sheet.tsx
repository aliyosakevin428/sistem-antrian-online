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
import { QueueCalls } from '@/types/queue_calls';
import { useForm, usePage } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  queue_calls?: QueueCalls;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const QueueCallsFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  queue_calls,
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
    queue_id : queue_calls?.queue_id ?? '',
user_id : queue_calls?.user_id ?? '',
counter_id : queue_calls?.counter_id ?? '',
called_at : queue_calls?.called_at ?? '',
finished_at : queue_calls?.finished_at ?? '',
notes : queue_calls?.notes ?? '',
call_number : queue_calls?.call_number ?? '',

  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('queue_calls.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('queue_calls.update', queue_calls?.id), {
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
          <SheetTitle>{capitalizeWords(purpose)} data queue_calls</SheetTitle>
          <SheetDescription>Form untuk {purpose} data queue_calls</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
                <FormControl label="Queue Id">
        <Select value={data.queue_id.toString()} onValueChange={(value) => setData('queue_id', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Pilih Queue Id" />
            </SelectTrigger>
            <SelectContent>
                {/* {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                ))}  */}
                <SelectItem value={data.queue_id.toString()}>{data.queue_id}</SelectItem>
            </SelectContent>
        </Select>
    </FormControl>
    <FormControl label="User Id">
        <Select value={data.user_id.toString()} onValueChange={(value) => setData('user_id', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Pilih User Id" />
            </SelectTrigger>
            <SelectContent>
                {/* {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                ))}  */}
                <SelectItem value={data.user_id.toString()}>{data.user_id}</SelectItem>
            </SelectContent>
        </Select>
    </FormControl>
    <FormControl label="Counter Id">
        <Select value={data.counter_id.toString()} onValueChange={(value) => setData('counter_id', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Pilih Counter Id" />
            </SelectTrigger>
            <SelectContent>
                {/* {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                ))}  */}
                <SelectItem value={data.counter_id.toString()}>{data.counter_id}</SelectItem>
            </SelectContent>
        </Select>
    </FormControl>
    <FormControl label="Called At">
        <Input type="text" placeholder="Enter Called At" value={data.called_at} onChange={(e) => setData('called_at', e.target.value)} />
    </FormControl>
    <FormControl label="Finished At">
        <Input type="text" placeholder="Enter Finished At" value={data.finished_at} onChange={(e) => setData('finished_at', e.target.value)} />
    </FormControl>
    <FormControl label="Notes">
        <Input type="text" placeholder="Enter Notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
    </FormControl>
    <FormControl label="Call Number">
        <Input type="text" placeholder="Enter Call Number" value={data.call_number} onChange={(e) => setData('call_number', e.target.value)} />
    </FormControl>
          </form>
        </ScrollArea>
        <SheetFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} queue_calls`} loading={processing} disabled={processing} />
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

export default QueueCallsFormSheet;
