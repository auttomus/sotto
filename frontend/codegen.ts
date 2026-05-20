import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. URL ke server NestJS milikmu (harus dalam keadaan menyala saat codegen dijalankan)
  schema: 'http://localhost:3000/graphql',

  // 2. Tempat tim frontend menyimpan file kueri mereka
  documents: ['app/features/**/api/*.graphql'],

  // 3. Output hasil terjemahannya
  generates: {
    // File 1: Base types saja (schema types, inputs, enums)
    'app/core/apollo/base-types.ts': {
      plugins: ['typescript'],
    },
    // File 2: Operations & React Hooks (mengimpor dari base-types)
    'app/core/apollo/generated.ts': {
      plugins: [
        'typescript-operations',
        'typescript-react-apollo' // Ini yang ajaib, mengubah GraphQL jadi React Hooks
      ],
      config: {
        withHooks: true,
        importSchemaTypesFrom: 'app/core/apollo/base-types',
      },
    },
  },
};

export default config;