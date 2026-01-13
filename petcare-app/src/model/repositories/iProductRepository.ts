import Product from "../entities/product";

export interface IProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;

  // Creates a new product and returns the created entity
  createProduct(data: { name: string; price: number; description?: string | null; imageUrl?: string | null }): Promise<Product>;

  // Updates an existing product and returns the updated entity
  updateProduct(id: string, data: { name?: string; price?: number; description?: string | null; imageUrl?: string | null }): Promise<Product>;

  // Deletes a product by id
  deleteProduct(id: string): Promise<void>;
}
