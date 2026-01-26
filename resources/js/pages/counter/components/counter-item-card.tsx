import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { Counter } from '@/types/counter';

type Props = {
  counter: Counter;
  className?: string;
};

const CounterItemCard: FC<Props> = ({ counter, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ counter.name }</CardTitle>
        <CardDescription>
          ID: { counter.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CounterItemCard;
