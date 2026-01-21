/**
 * Configuração do Jest para testes
 * 
 * IMPORTANTE: Esta configuração ignora node_modules para evitar
 * problemas com arquivos TypeScript do react-native que não devem
 * ser processados pelo Babel durante os testes.
 * 
 * O erro que estava acontecendo:
 * - O Jest tentava processar arquivos TypeScript do react-native em node_modules
 * - O Babel não conseguia processar a sintaxe TypeScript (ex: TimeoutID: void)
 * - Solução: Ignorar completamente node_modules durante a transformação
 */
module.exports = {
  // Ambiente de teste (node, não jsdom, pois testamos lógica de negócio)
  testEnvironment: 'node',
  
  // Define onde estão os testes
  roots: ['<rootDir>/__test__'],
  testMatch: [
    '**/__test__/**/*.test.ts',
    '**/__test__/**/*.test.tsx'
  ],
  
  // Transforma TypeScript usando babel-jest
  // O Babel vai usar a configuração do babel.config.js do projeto (se existir)
  // ou a configuração padrão do Expo
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  
  // IGNORA completamente node_modules durante a transformação
  // Isso evita que o Jest tente processar arquivos TypeScript do react-native
  // que causam o erro: "SyntaxError: value(id: TimeoutID): void {"
  transformIgnorePatterns: [
    'node_modules/'
  ],
  
  // Mapeia imports com @ para o caminho correto
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Arquivos para cobertura de código
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  
  // Setup antes dos testes (carrega tipos do Jest)
  setupFilesAfterEnv: ['<rootDir>/__test__/setup.ts'],
  
  // Extensões de arquivo que o Jest reconhece
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Ignora esses caminhos nos testes
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
};
