import Pet from "./pet";

export default interface User {
  id: string;
  userName: string;
  email?: string | null;
  // outros campos do domínio (avatar, role, etc)
}