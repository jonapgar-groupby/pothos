import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import DrizzlePlugin from '../../src';
import { db, DrizzleSchema } from './db';

export default new SchemaBuilder<{
  DrizzleSchema: DrizzleSchema;
}>({
  plugins: [ScopeAuthPlugin, DrizzlePlugin],
  drizzle: {
    client: db,
  },
  scopeAuth: {
    authScopes: () => ({}),
  },
});
