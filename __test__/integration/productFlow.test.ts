import { ProductUseCases } from "../../src/usecase/product/productUseCases";
import { MockProductRepository } from "../mocks/ProductRepositoryMock";
import { mockProducts } from "../data/mockData";

/**
 * Testes de integração para fluxo completo de produtos
 * Testa a integração entre ProductUseCases e ProductRepository
 * Usa os dados mockados da pasta /__test__/data (mockProducts)
 */
describe("Fluxo de Produtos - Integração", () => {
  let productUseCases: ProductUseCases;
  let mockRepository: MockProductRepository;

  // Executa antes de cada teste
  beforeEach(() => {
    mockRepository = new MockProductRepository();
    productUseCases = new ProductUseCases(mockRepository);
  });

  /**
   * Teste: Fluxo completo de busca de produtos
   * Simula o fluxo real de um usuário navegando pela loja
   */
  it("deve permitir buscar todos os produtos e depois um específico", async () => {
    // Act 1: Busca todos os produtos (como na tela da loja)
    const allProducts = await productUseCases.getAllProducts();

    // Assert 1: Verifica se retornou todos os produtos
    expect(allProducts).toHaveLength(mockProducts.length);
    expect(allProducts.length).toBeGreaterThan(0);

    // Act 2: Busca um produto específico pelo ID (como na tela de detalhes)
    const firstProductId = allProducts[0].id;
    const specificProduct = await productUseCases.getProductById(
      firstProductId
    );

    // Assert 2: Verifica se o produto específico foi encontrado
    expect(specificProduct).not.toBeNull();
    expect(specificProduct?.id).toBe(firstProductId);
    expect(specificProduct?.name).toBeDefined();
    expect(specificProduct?.price).toBeGreaterThan(0);
  });

  /**
   * Teste: Fluxo de busca de produto inexistente
   * Verifica o comportamento quando busca um produto que não existe
   */
  it("deve retornar null ao buscar produto inexistente", async () => {
    // Arrange: Define um ID que não existe
    const nonExistentId = "produto_inexistente";

    // Act: Busca o produto
    const product = await productUseCases.getProductById(nonExistentId);

    // Assert: Verifica que retornou null
    expect(product).toBeNull();
  });

  /**
   * Teste: Fluxo de validação de dados dos produtos
   * Verifica se todos os produtos retornados têm dados válidos
   */
  it("deve retornar produtos com dados válidos", async () => {
    // Act: Busca todos os produtos
    const products = await productUseCases.getAllProducts();

    // Assert: Verifica se cada produto tem os dados necessários
    products.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.id).not.toBe("");
      expect(product.name).toBeDefined();
      expect(product.name).not.toBe("");
      expect(product.price).toBeGreaterThan(0);
      expect(typeof product.price).toBe("number");
    });
  });

  /**
   * Teste: Fluxo de ordenação de produtos por preço
   * Simula um usuário ordenando produtos por preço
   */
  it("deve permitir ordenar produtos por preço", async () => {
    // Act: Busca todos os produtos
    const products = await productUseCases.getAllProducts();

    // Act: Ordena por preço (crescente)
    const sortedByPrice = [...products].sort((a, b) => a.price - b.price);

    // Assert: Verifica se a ordenação está correta
    expect(sortedByPrice.length).toBe(products.length);
    for (let i = 0; i < sortedByPrice.length - 1; i++) {
      expect(sortedByPrice[i].price).toBeLessThanOrEqual(
        sortedByPrice[i + 1].price
      );
    }
  });
});
