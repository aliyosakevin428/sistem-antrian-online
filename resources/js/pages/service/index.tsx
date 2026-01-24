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
import { Service } from '@/types/service';
import { Link, router, usePage } from '@inertiajs/react';
import { Archive, Edit, Filter, Folder, Grid2X2, TableIcon, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import ServiceBulkDeleteDialog from './components/service-bulk-delete-dialog';
import ServiceBulkEditSheet from './components/service-bulk-edit-sheet';
import ServiceDeleteDialog from './components/service-delete-dialog';
import ServiceFilterSheet from './components/service-filter-sheet';
import ServiceFormSheet from './components/service-form-sheet';
import ServiceItemCard from './components/service-item-card';

type Props = {
  services: Service[];
  query: { [key: string]: string };
};

const ServiceList: FC<Props> = ({ services, query }) => {
  const { mode, toggle } = useViewMode();
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const { permissions } = usePage<SharedData>().props;

  return (
    <AppLayout
      title="Services"
      description="Manage your services"
      actions={[
        {
          title: capitalizeWords(mode) + ' view',
          icon: mode === 'grid' ? Grid2X2 : TableIcon,
          onClick: toggle,
        },
        {
          title: 'Archived',
          icon: Archive,
          onClick: () => router.visit(route('service.archived')),
        },
      ]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search services..." value={cari} onChange={(e) => setCari(e.target.value)} />
        <ServiceFilterSheet query={query}>
          <Button>
            <Filter />
            Filter data
            {Object.values(query).filter((val) => val && val !== '').length > 0 && (
              <Badge variant="secondary">{Object.values(query).filter((val) => val && val !== '').length}</Badge>
            )}
          </Button>
        </ServiceFilterSheet>
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
            <ServiceBulkEditSheet serviceIds={ids} onSuccess={() => setIds([])}>
              <Button>
                <Edit /> Edit selected
              </Button>
            </ServiceBulkEditSheet>
            <ServiceBulkDeleteDialog serviceIds={ids} onSuccess={() => setIds([])}>
              <Button variant={'destructive'}>
                <Trash2 /> Delete selected
              </Button>
            </ServiceBulkDeleteDialog>
          </>
        )}
        {permissions?.canAdd && <ServiceFormSheet purpose="create" buttonLabel="New service" />}
      </div>
      {mode === 'table' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant={'ghost'} size={'icon'} asChild>
                  <Label>
                    <Checkbox
                      checked={ids.length === services.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setIds(services.map((service) => service.id));
                        } else {
                          setIds([]);
                        }
                      }}
                    />
                  </Label>
                </Button>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Is Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services
              .filter((service) => JSON.stringify(service).toLowerCase().includes(cari.toLowerCase()))
              .map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Button variant={'ghost'} size={'icon'} asChild>
                      <Label>
                        <Checkbox
                          checked={ids.includes(service.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIds([...ids, service.id]);
                            } else {
                              setIds(ids.filter((id) => id !== service.id));
                            }
                          }}
                        />
                      </Label>
                    </Button>
                  </TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.code}</TableCell>
                  <TableCell>
                    {service.is_active !== undefined ? (
                      <span className={service.is_active ? 'text-green-600' : 'text-red-600'}>{service.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>{' '}
                  <TableCell>
                    {permissions?.canShow && (
                      <Button variant={'ghost'} size={'icon'}>
                        <Link href={route('service.show', service.id)}>
                          <Folder />
                        </Link>
                      </Button>
                    )}
                    {permissions?.canUpdate && (
                      <>
                        <ServiceFormSheet purpose="edit" service={service} variant="icon" />
                      </>
                    )}
                    {permissions?.canDelete && (
                      <ServiceDeleteDialog service={service}>
                        <Button variant={'ghost'} size={'icon'}>
                          <Trash2 />
                        </Button>
                      </ServiceDeleteDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid-responsive grid gap-4">
          {services
            .filter((service) => JSON.stringify(service).toLowerCase().includes(cari.toLowerCase()))
            .map((service) => (
              <ServiceItemCard key={service.id} service={service} />
            ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ServiceList;
