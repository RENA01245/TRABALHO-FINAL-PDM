import AuthValidator from "../../src/usecase/validator/authValidator";
import { ValidationError } from "../../src/model/errors/validationError";

/**
 * Testes unitários para AuthValidator
 * Testa as validações de dados de autenticação
 */
describe("AuthValidator", () => {
  /**
   * Teste: Validação de login
   * Verifica se os dados de login são validados corretamente
   */
  describe("validateLogin", () => {
    it("deve passar quando email e senha são válidos", () => {
      // Arrange: Define dados válidos
      const validEmail = "teste@email.com";
      const validPassword = "senha123";

      // Act & Assert: Não deve lançar erro
      expect(() => {
        AuthValidator.validateLogin(validEmail, validPassword);
      }).not.toThrow();
    });

    it("deve lançar erro quando email está vazio", () => {
      // Arrange: Define email vazio
      const emptyEmail = "";
      const validPassword = "senha123";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateLogin(emptyEmail, validPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando email é apenas espaços", () => {
      // Arrange: Define email com apenas espaços
      const whitespaceEmail = "   ";
      const validPassword = "senha123";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateLogin(whitespaceEmail, validPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando senha está vazia", () => {
      // Arrange: Define senha vazia
      const validEmail = "teste@email.com";
      const emptyPassword = "";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateLogin(validEmail, emptyPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando senha é apenas espaços", () => {
      // Arrange: Define senha com apenas espaços
      const validEmail = "teste@email.com";
      const whitespacePassword = "   ";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateLogin(validEmail, whitespacePassword);
      }).toThrow(ValidationError);
    });
  });

  /**
   * Teste: Validação de cadastro
   * Verifica se os dados de cadastro são validados corretamente
   */
  describe("validateSignUp", () => {
    it("deve passar quando todos os dados são válidos", () => {
      // Arrange: Define dados válidos
      const validName = "João Silva";
      const validEmail = "joao@email.com";
      const validPassword = "senha123";

      // Act & Assert: Não deve lançar erro
      expect(() => {
        AuthValidator.validateSignUp(validName, validEmail, validPassword);
      }).not.toThrow();
    });

    it("deve lançar erro quando nome está vazio", () => {
      // Arrange: Define nome vazio
      const emptyName = "";
      const validEmail = "joao@email.com";
      const validPassword = "senha123";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateSignUp(emptyName, validEmail, validPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando email está vazio", () => {
      // Arrange: Define email vazio
      const validName = "João Silva";
      const emptyEmail = "";
      const validPassword = "senha123";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateSignUp(validName, emptyEmail, validPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando email é inválido", () => {
      // Arrange: Define email com formato inválido
      const validName = "João Silva";
      const invalidEmail = "email-invalido";
      const validPassword = "senha123";

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateSignUp(validName, invalidEmail, validPassword);
      }).toThrow(ValidationError);
    });

    it("deve lançar erro quando senha tem menos de 6 caracteres", () => {
      // Arrange: Define senha muito curta
      const validName = "João Silva";
      const validEmail = "joao@email.com";
      const shortPassword = "12345"; // Menos de 6 caracteres

      // Act & Assert: Deve lançar ValidationError
      expect(() => {
        AuthValidator.validateSignUp(validName, validEmail, shortPassword);
      }).toThrow(ValidationError);
    });

    it("deve passar quando senha tem exatamente 6 caracteres", () => {
      // Arrange: Define senha com 6 caracteres (mínimo)
      const validName = "João Silva";
      const validEmail = "joao@email.com";
      const minPassword = "123456"; // Exatamente 6 caracteres

      // Act & Assert: Não deve lançar erro
      expect(() => {
        AuthValidator.validateSignUp(validName, validEmail, minPassword);
      }).not.toThrow();
    });
  describe("validateStrongPassword", () => {
    it("deve lançar erro se a senha tiver menos de 8 caracteres", () => {
      expect(() => AuthValidator.validateStrongPassword("Ab1!")).toThrow(
        new ValidationError("A senha deve ter pelo menos 8 caracteres.")
      );
    });

    it("deve lançar erro se a senha não tiver letra maiúscula", () => {
      expect(() => AuthValidator.validateStrongPassword("abcdef1!")).toThrow(
        new ValidationError("A senha deve conter pelo menos uma letra maiúscula.")
      );
    });

    it("deve lançar erro se a senha não tiver letra minúscula", () => {
      expect(() => AuthValidator.validateStrongPassword("ABCDEF1!")).toThrow(
        new ValidationError("A senha deve conter pelo menos uma letra minúscula.")
      );
    });

    it("deve lançar erro se a senha não tiver número", () => {
      expect(() => AuthValidator.validateStrongPassword("Abcdefgh!")).toThrow(
        new ValidationError("A senha deve conter pelo menos um número.")
      );
    });

    it("deve lançar erro se a senha não tiver caractere especial", () => {
      expect(() => AuthValidator.validateStrongPassword("Abcdefg1")).toThrow(
        new ValidationError("A senha deve conter pelo menos um caractere especial.")
      );
    });

    it("não deve lançar erro para senha forte válida", () => {
      expect(() => AuthValidator.validateStrongPassword("Abcdef1!")).not.toThrow();
    });
  });
});
});
