import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { backAction, em } from '@/lib/utils';
import { Counter } from '@/types/counter';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Undo2 } from 'lucide-react';
import { FC, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  counters: Counter[];
};

const ArchivedCounterList: FC<Props> = ({ counters }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [cari, setCari] = useState('');

  const handleRestore = (id: Counter['id']) => {
    router.put(
      route('counter.restore', id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success('Data berhasil di restore!'),
        onError: (e) => toast.error(em(e)),
      },
    );
  };

  const handleForceDelete = (id: Counter['id']) => {
    router.delete(route('counter.force-delete', id), {
      preserveScroll: true,
      onSuccess: () => toast.success('Data berhasil di hapus permanen!'),
      onError: (e) => toast.error(em(e)),
    });
  };

  return (
    <AppLayout
      title="Counters"
      description="Manage your counters"
      actions={[backAction()]}
    >
      <div className="flex gap-2">
        <Input placeholder="Search counters..." value={cari} onChange={(e) => setCari(e.target.value)} />
        {ids.length > 0 && (
          <>
            <Button variant={'ghost'} disabled>
              {ids.length} item selected
            </Button>
          </>
        )}
      </div>
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
            <TableHead>Name</TableHead>
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
                <TableCell>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleRestore(counter.id)}>
                    <Undo2 />
                  </Button>
                  <Button variant={'ghost'} size={'icon'} onClick={() => handleForceDelete(counter.id)}>
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </AppLayout>
  );
};

export default ArchivedCounterList;