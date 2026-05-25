import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. URL ke server NestJS milikmu (membaca offline schema untuk keandalan)
  schema: '../backend/src/schema.gql',

  // 2. Tempat tim frontend menyimpan file kueri mereka
  documents: ['app/features/**/api/*.graphql'],

  // 3. Output hasil terjemahannya
  generates: {
    // File 1: Base types saja (schema types, inputs, enums)
    'app/core/apollo/base-types.ts': {
      plugins: ['typescript'],
      config: {
        scalars: {
          DateTime: 'string',
          Date: 'string',
        },
      },
    },
    // File 2: Operations & React Hooks (mengimpor dari base-types)
    'app/core/apollo/generated.ts': {
      plugins: [
        'typescript-operations',
        'typescript-react-apollo' // Ini yang ajaib, mengubah GraphQL jadi React Hooks
      ],
      config: {
        withHooks: true,
        withSuspense: false,
        excludeSuspense: true,
        reactApolloVersion: 4,
        apolloReactHooksImportFrom: '@apollo/client/react',
        importSchemaTypesFrom: './base-types',
        scalars: {
          DateTime: 'string',
          Date: 'string',
        },
        banner: '/* eslint-disable */\n// @ts-nocheck\n',
      },
    },
  },
};

export default config;