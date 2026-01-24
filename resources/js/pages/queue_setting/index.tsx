import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/hooks/use-view-mode';
import AppLayout from '@/layouts/app-layout';
import { capitalizeWords, formatQueueNumber } from '@/lib/utils';
import { SharedData } from '@/types';
import { QueueSetting } from '@/types/queue_setting';
import { Link, usePage } from '@inertiajs/react';
import { Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import QueueSettingBulkDeleteDialog from './components/queue_setting-bulk-delete-dialog';
import QueueSettingBulkEditSheet from './components/queue_setting-bulk-edit-sheet';
import QueueSettingDeleteDialog from './components/queue_setting-delete-dialog';
import QueueSettingFilterSheet from './components/queue_setting-filter-sheet';
import QueueSettingFormSheet from './components/queue_setting-form-sheet';
import QueueSettingItemCard from './components/queue_setting-item-card';

type Props = {
  queue_settings: QueueSetting[];
  query: { [key: string]: string };
};

const QueueSettingList: FC<Props> = ({ queue_settings, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Pengaturan Antrian"
      description="Kelola pengaturan antrian layanan di sistem antrian online."
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search queue_settings..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <QueueSettingFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </QueueSettingFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <QueueSettingBulkEditSheet queue_settingIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </QueueSettingBulkEditSheet>
            <QueueSettingBulkDeleteDialog queue_settingIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </QueueSettingBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <QueueSettingFormSheet purpose="create" buttonLabel="New Queue Setting" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === queue_settings?.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(queue_settings.map((queue_setting) => queue_setting.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Jenis Pelayanan</TableHead>
              <TableHead>Kode Pelayanan</TableHead>
              <TableHead>Start Number</TableHead>
              <TableHead>Max Per Day</TableHead>
              <TableHead>Reset Daily</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queue_settings
              .filter((queue_setting) => JSON.stringify(queue_setting).toLowerCase().includes(cari.toLowerCase()))
              .map((queue_setting) => (
                <TableRow key={queue_setting.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(queue_setting.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, queue_setting.id]);
                            } else {
                              setIds(ids.filter((id) => id !== queue_setting.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{queue_setting.service?.name || '-'}</TableCell>
                  <TableCell>{queue_setting.prefix}</TableCell>
                  <TableCell>{formatQueueNumber(queue_setting.start_number)}</TableCell>
                  <TableCell>{queue_setting.max_queue}</TableCell>
                  <TableCell>
                    {queue_setting.reset_daily !== undefined ? (
                      <span className={queue_setting.reset_daily ? 'text-green-600' : 'text-red-600'}>
                        {queue_setting.reset_daily ? 'Aktif' : 'Nonaktif'}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>{' '}
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('queue-setting.show', queue_setting.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <QueueSettingFormSheet purpose="edit" queue_setting={queue_setting} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <QueueSettingDeleteDialog queue_setting={queue_setting}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </QueueSettingDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {queue_settings
            .filter((queue_setting) => JSON.stringify(queue_setting).toLowerCase().includes(cari.toLowerCase()))
            .map((queue_setting) => (
              <QueueSettingItemCard key={queue_setting.id} queue_setting={queue_setting} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default QueueSettingList;
