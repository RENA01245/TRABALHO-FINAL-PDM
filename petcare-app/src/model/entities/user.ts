import Pet from "./pet";

export default interface User {
  uID: string;
  userName: string;
  email: string ;
  telefone?: string | null;
  pets: Pet[];
}