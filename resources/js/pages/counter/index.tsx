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
import { Counter } from '@/types/counter';
import { Link, router, usePage } from '@inertiajs/react';
import { Archive, Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import CounterBulkDeleteDialog from './components/counter-bulk-delete-dialog';
import CounterBulkEditSheet from './components/counter-bulk-edit-sheet';
import CounterDeleteDialog from './components/counter-delete-dialog';
import CounterFilterSheet from './components/counter-filter-sheet';
import CounterFormSheet from './components/counter-form-sheet';
import CounterItemCard from './components/counter-item-card';

type Props = {
  counters: Counter[];
  query: { [key: string]: string };
};

const CounterList: FC<Props> = ({ counters, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Daftar Loket"
      description="Kelola loket untuk sistem antrian Anda."
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
        {
          title: 'Archived',
          icon: Archive,
          onClick: () => router.visit(route('counter.archived')),
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search counters..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <CounterFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </CounterFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <CounterBulkEditSheet counterIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </CounterBulkEditSheet>
            <CounterBulkDeleteDialog counterIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </CounterBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <CounterFormSheet purpose="create" buttonLabel="New counter" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === counters.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(counters.map((counter) => counter.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Nama Loket</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {counters
              .filter((counter) => JSON.stringify(counter).toLowerCase().includes(cari.toLowerCase()))
              .map((counter) => (
                <TableRow key={counter.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(counter.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, counter.id]);
                            } else {
                              setIds(ids.filter((id) => id !== counter.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{counter.name}</TableCell>
                  <TableCell>{counter.services.map((service) => service.name).join(', ') || '-'}</TableCell>
                  <TableCell>
                    {counter.is_active !== undefined ? (
                      <span className={counter.is_active ? 'text-green-600' : 'text-red-600'}>{counter.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>{' '}
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('counter.show', counter.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <CounterFormSheet purpose="edit" counter={counter} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <CounterDeleteDialog counter={counter}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </CounterDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {counters
            .filter((counter) => JSON.stringify(counter).toLowerCase().includes(cari.toLowerCase()))
            .map((counter) => (
              <CounterItemCard key={counter.id} counter={counter} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default CounterList;
