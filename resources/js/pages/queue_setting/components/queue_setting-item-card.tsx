import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FC } from 'react';
import { QueueSetting } from '@/types/queue_setting';

type Props = {
  queue_setting: QueueSetting;
  className?: string;
};

const QueueSettingItemCard: FC<Props> = ({ queue_setting, className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="leading-normal">{ queue_setting.name }</CardTitle>
        <CardDescription>
          ID: { queue_setting.id }
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default QueueSettingItemCard;
