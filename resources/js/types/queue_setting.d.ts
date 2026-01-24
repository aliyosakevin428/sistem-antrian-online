import { Service } from './service';

export type QueueSetting = {
  id: number;
  service_id: Service['id'];
  service: Service;
  prefix: string;
  start_number: number;
  max_queue: number;
  reset_daily: boolean;
  created_at: string;
  updated_at: string;
};
