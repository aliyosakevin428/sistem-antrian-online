import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { Queue } from '@/types/queue';

type Props = {
  queue: Queue;
  className?: string;
};

const QueueItemCard: FC<Props> = ({ queue, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ queue.name }</CardTitle>
        <CardDescription>
          ID: { queue.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default QueueItemCard;
