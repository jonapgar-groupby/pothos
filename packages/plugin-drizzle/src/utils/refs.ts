import { InterfaceRef, ObjectRef, SchemaTypes } from '@pothos/core';

export const refMap = new WeakMap<
  object,
  Map<string, InterfaceRef<never, {}> | ObjectRef<never, {}>>
>();

export function getRefFromModel<Types extends SchemaTypes>(
  name: string,
  builder: PothosSchemaTypes.SchemaBuilder<Types>,
  type: 'interface' | 'object' = 'object',
): InterfaceRef<Types, {}> | ObjectRef<Types, {}> {
  if (!refMap.has(builder)) {
    refMap.set(builder, new Map());
  }
  const cache = refMap.get(builder)!;

  if (!cache.has(name)) {
    cache.set(name, type === 'object' ? new ObjectRef(name) : new InterfaceRef(name));
  }

  return cache.get(name)! as never;
}
