import { Counter } from './counter';
import { Queue } from './queue';
import { User } from './user';

export type QueueCalls = {
  id: number;
  queue_id: Queue['id'];
  queue: Queue;
  user_id: User['id'];
  user: User;
  counter_id: Counter['id'];
  counter: Counter;
  called_at: string;
  finished_at: string;
  notes: string;
  call_number: string;
  created_at: string;
  updated_at: string;
};
