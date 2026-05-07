import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. URL ke server NestJS milikmu (harus dalam keadaan menyala saat codegen dijalankan)
  schema: 'http://localhost:3000/graphql',
  
  // 2. Tempat tim frontend menyimpan file kueri mereka
  documents: ['src/features/**/api/*.graphql'],
  
  // 3. Output hasil terjemahannya
  generates: {
    'src/core/apollo/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo' // Ini yang ajaib, mengubah GraphQL jadi React Hooks
      ],
      config: {
        withHooks: true,
      },
    },
  },
};

export default config;