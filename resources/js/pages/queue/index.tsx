import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords } from '@/lib/utils';
import { SharedData } from '@/types';
import { Queue } from '@/types/queue';
import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import QueueBulkDeleteDialog from './components/queue-bulk-delete-dialog';
import QueueBulkEditSheet from './components/queue-bulk-edit-sheet';
import QueueDeleteDialog from './components/queue-delete-dialog';
import QueueFilterSheet from './components/queue-filter-sheet';
import QueueFormSheet from './components/queue-form-sheet';
import QueueItemCard from './components/queue-item-card';

type Props = {
  queues: Queue[];
  query: { [key: string]: string };
};

const QueueList: FC<Props> = ({ queues, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Daftar Antrian"
      description="Kelola dan pantau daftar antrian layanan Anda di sini."
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search queues..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <QueueFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </QueueFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <QueueBulkEditSheet queueIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </QueueBulkEditSheet>
            <QueueBulkDeleteDialog queueIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </QueueBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <QueueFormSheet purpose="create" buttonLabel="New queue" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === queues.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(queues.map((queue) => queue.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Pelayanan</TableHead>
              <TableHead>Nomor Antrian</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Tanggal Antrian</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues
              .filter((queue) => JSON.stringify(queue).toLowerCase().includes(cari.toLowerCase()))
              .map((queue) => (
                <TableRow key={queue.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(queue.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, queue.id]);
                            } else {
                              setIds(ids.filter((id) => id !== queue.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{queue.service?.name || '-'}</TableCell>
                  <TableCell>{queue.queue_number}</TableCell>
                  <TableCell>{queue.status}</TableCell>
                  <TableCell>{dayjs(queue.queue_date).format('DD MMMM YYYY')}</TableCell>

                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('queue.show', queue.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <QueueFormSheet purpose="edit" queue={queue} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <QueueDeleteDialog queue={queue}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </QueueDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {queues
            .filter((queue) => JSON.stringify(queue).toLowerCase().includes(cari.toLowerCase()))
            .map((queue) => (
              <QueueItemCard key={queue.id} queue={queue} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default QueueList;
