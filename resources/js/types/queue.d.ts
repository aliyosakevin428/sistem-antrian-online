import { Service } from "./service";

export type Queue = {
  id: number;
  service_id: Service['id'];
  service: Service;
  queue_number: string;
  status: 'waiting' | 'in_progress' | 'finished' | 'skipped';
  queue_date: string;
  created_at: string;
  updated_at: string;
};
