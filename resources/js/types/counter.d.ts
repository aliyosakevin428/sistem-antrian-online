import { Service } from './service';

export type Counter = {
  id: number;
  name: string;
  is_active: boolean;
  today_served: number;
  waiting: number;
  operational_started_at: string | null;
  break_started_at?: string | null;
  services?: Service[];
  created_at: string;
  updated_at: string;
};
