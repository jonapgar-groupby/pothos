import SchemaBuilder, { ObjectRef, SchemaTypes } from '@pothos/core';
import { DrizzleObjectFieldBuilder } from './drizzle-field-builder';
import { getRefFromModel } from './utils/refs';

const schemaBuilderProto = SchemaBuilder.prototype as PothosSchemaTypes.SchemaBuilder<SchemaTypes>;

schemaBuilderProto.drizzleObject = function drizzleObject(
  table,
  { name, select, fields, ...options },
) {
  const ref = getRefFromModel(table, this, 'object') as ObjectRef<SchemaTypes, unknown>;

  ref.name = name ?? table;

  this.objectType(ref, {
    ...(options as {}),
    extensions: {
      ...options.extensions,
      pothosDrizzleModel: table,
      pothosDrizzleSelect: select,
    },
    name,
    fields: fields ? () => fields(new DrizzleObjectFieldBuilder(ref.name, this, table)) : undefined,
  });

  return ref as never;
};
