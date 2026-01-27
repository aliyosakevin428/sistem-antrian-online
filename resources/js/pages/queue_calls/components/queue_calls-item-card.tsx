import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { QueueCalls } from '@/types/queue_calls';

type Props = {
  queue_calls: QueueCalls;
  className?: string;
};

const QueueCallsItemCard: FC<Props> = ({ queue_calls, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ queue_calls.name }</CardTitle>
        <CardDescription>
          ID: { queue_calls.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default QueueCallsItemCard;
