export default interface Pet {
  id: string;
  clientId: string; 
  name: string;
  breed: string | null; 
  age: number | null; 
  observations: string | null; 
}
