export default interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null; 
  createdAt: string | null; 
}
