import { ProductUseCases } from "../../src/usecase/product/productUseCases";
import { MockProductRepository } from "../mocks/ProductRepositoryMock";
import { mockProducts } from "../data/mockData";
import { RepositoryError } from "../../src/model/errors/repositoryError";

/**
 * Testes unitários para ProductUseCases
 * Testa a lógica de negócio relacionada a produtos
 * Usa os dados mockados da pasta /__test__/data (mockProducts)
 */
describe("ProductUseCases", () => {
  let productUseCases: ProductUseCases;
  let mockRepository: MockProductRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockProductRepository();
    productUseCases = new ProductUseCases(mockRepository);
  });

  /**
   * Teste: Deve retornar todos os produtos
   * Verifica se a função getAllProducts retorna a lista completa
   */
  describe("getAllProducts", () => {
    it("deve retornar todos os produtos disponíveis", async () => {
      // Act: Chama o método que queremos testar
      const products = await productUseCases.getAllProducts();

      // Assert: Verifica se o resultado está correto
      expect(products).toHaveLength(mockProducts.length);
      expect(products).toEqual(mockProducts);
    });

    it("deve retornar produtos com todas as propriedades corretas", async () => {
      // Act: Busca todos os produtos
      const products = await productUseCases.getAllProducts();

      // Assert: Verifica se cada produto tem as propriedades esperadas
      products.forEach((product) => {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("name");
        expect(product).toHaveProperty("price");
        expect(product.price).toBeGreaterThan(0);
      });
    });
  });

  /**
   * Teste: Deve buscar um produto por ID
   * Verifica se a função getProductById retorna o produto correto
   */
  describe("getProductById", () => {
    it("deve retornar o produto quando o ID existe", async () => {
      // Arrange: Define um ID que sabemos que existe nos mocks
      const existingId = "1";

      // Act: Busca o produto pelo ID
      const product = await productUseCases.getProductById(existingId);

      // Assert: Verifica se o produto foi encontrado e tem os dados corretos
      expect(product).not.toBeNull();
      expect(product?.id).toBe(existingId);
      expect(product?.name).toBe("Comedouro automático para cães");
      expect(product?.price).toBe(99.99);
    });

    it("deve retornar null quando o ID não existe", async () => {
      // Arrange: Define um ID que não existe
      const nonExistentId = "999";

      // Act: Busca o produto pelo ID
      const product = await productUseCases.getProductById(nonExistentId);

      // Assert: Verifica que retornou null
      expect(product).toBeNull();
    });

    it("deve lançar erro quando o ID é inválido", async () => {
      // Arrange: Define um ID vazio ou inválido
      const invalidId = "";

      // Act & Assert: Verifica se lança um erro
      await expect(productUseCases.getProductById(invalidId)).rejects.toThrow(
        RepositoryError
      );
    });
  });
});
