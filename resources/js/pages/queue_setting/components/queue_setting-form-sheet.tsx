import FormControl from '@/components/form-control';
import SubmitButton from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { capitalizeWords, em } from '@/lib/utils';
import { FormPurpose, Item } from '@/types';
import { QueueSetting } from '@/types/queue_setting';
import { useForm, usePage } from '@inertiajs/react';
import { Copy, Edit, LucideIcon, PlusSquare, X } from 'lucide-react';
import { ComponentProps, FC, PropsWithChildren } from 'react';
import { toast } from 'sonner';
import { Service } from '@/types/service';

type Props = PropsWithChildren & {
  queue_setting?: QueueSetting;
  icon?: LucideIcon;
  buttonLabel?: string;
  purpose: FormPurpose;
  variant?: 'default' | 'icon';
  onSuccess?: () => void;
  withChildren?: boolean;
};

const QueueSettingFormSheet: FC<ComponentProps<typeof Sheet> & Props> = ({
  children,
  queue_setting,
  purpose,
  variant = 'default',
  icon: Icon,
  buttonLabel,
  onSuccess,
  open,
  onOpenChange,
  withChildren = true,
}) => {

  const { services = [] } = usePage<{ services: Service[] }>().props;

  const { data, setData, put, post, processing } = useForm({
    service_id : queue_setting?.service_id ?? null,
    prefix : queue_setting?.prefix ?? '',
    start_number : queue_setting?.start_number ?? '',
    max_queue : queue_setting?.max_queue ?? '',
    reset_daily : queue_setting?.reset_daily ?? '',

  });

  const handleSubmit = () => {
    if (purpose === 'create' || purpose === 'duplicate') {
      post(route('queue-setting.store'), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Queue Setting created successfully');
          onOpenChange?.(false);
          onSuccess?.();
        },
        onError: (e) => toast.error(em(e)),
      });
    } else {
      put(route('queue-setting.update', queue_setting?.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Queue Setting updated successfully');
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
          <SheetTitle>{capitalizeWords(purpose)} data queue_setting</SheetTitle>
          <SheetDescription>Form untuk {purpose} data queue_setting</SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <form
            className="space-y-6 px-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl label="Jenis Pelayanan">
              <Select value={data.service_id ? data.service_id.toString() : ''} onValueChange={(value) => setData('service_id', Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Pelayanan" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormControl label="Prefix">
              <Input type="text" placeholder="Enter Prefix" value={data.prefix} onChange={(e) => setData('prefix', e.target.value)} />
            </FormControl>
            <FormControl label="Start Number">
              <Input
                type="number"
                placeholder="Enter Start Number"
                value={data.start_number}
                onChange={(e) => setData('start_number', e.target.value)}
              />
            </FormControl>
            <FormControl label="Max Per Day">
              <Input type="number" placeholder="Enter Max Per Day" value={data.max_queue} onChange={(e) => setData('max_queue', e.target.value)} />
            </FormControl>
            <FormControl label="Reset Daily">
              <Select value={data.reset_daily ? '1' : '0'} onValueChange={(value) => setData('reset_daily', value === '1')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Reset Daily Status" />
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
          <SubmitButton onClick={handleSubmit} label={`${capitalizeWords(purpose)} queue setting`} loading={processing} disabled={processing} />
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

export default QueueSettingFormSheet;
