import { Counter } from './counter';
import { Role } from './role';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  media?: Media[];
  roles?: Role[];
  counter?: Counter;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}
