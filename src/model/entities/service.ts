export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  estimatedDuration: number | null;
  type: string | null;
}