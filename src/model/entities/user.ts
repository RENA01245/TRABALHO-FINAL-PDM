import Pet from "./pet";

export default interface User {
  uID: string;
  userName: string;
  email: string ;
  telefone?: string | null;
  createdAt?: Date; // Adicionado para refletir o banco
  pets: Pet[];
}