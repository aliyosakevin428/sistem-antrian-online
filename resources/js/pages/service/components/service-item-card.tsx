import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { Service } from '@/types/service';

type Props = {
  service: Service;
  className?: string;
};

const ServiceItemCard: FC<Props> = ({ service, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ service.name }</CardTitle>
        <CardDescription>
          ID: { service.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default ServiceItemCard;
