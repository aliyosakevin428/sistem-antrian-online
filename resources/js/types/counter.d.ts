import { Service } from "./service";

export type Counter = {
  id: number;
  name: string;
  is_active: boolean;
  services: Service[];
  created_at: string;
  updated_at: string;
};
