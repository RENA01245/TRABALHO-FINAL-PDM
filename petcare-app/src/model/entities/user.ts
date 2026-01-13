import Pet from "./pet";

export type UserRole = 'admin' | 'patient';

export default interface User {
  uID: string;
  userName: string;
  email: string ;
  telefone?: string | null;
  pets: Pet[];
  role?: UserRole;
}