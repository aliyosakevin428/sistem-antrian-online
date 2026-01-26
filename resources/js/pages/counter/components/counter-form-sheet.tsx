import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose } from '@/types';
import { Counter } from '@/types/counter';
import { useForm } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';

type Props = PropsWithChildren & {
  counter?: Counter;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const CounterFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  counter,
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
    name : counter?.name ?? '',
    is_active : counter?.is_active ?? '',

  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('counter.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('User created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('counter.update', counter?.id), {
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
          <SheetTitle>{capitalizeWords(purpose)} data counter</SheetTitle>
          <SheetDescription>Form untuk {purpose} data counter</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Nama Loket">
              <Input type="text" placeholder="Enter Name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            </FormControl>
            <FormControl label="Keterangan">
              <Select value={data.is_active ? '1' : '0'} onValueChange={(value) => setData('is_active', value === '1')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Active</SelectItem>
                  <SelectItem value="0">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </form>
        </ScrollArea>
        <SheetFooter>
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} counter`} loading={processing} disabled={processing} />
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

export default CounterFormSheet;
