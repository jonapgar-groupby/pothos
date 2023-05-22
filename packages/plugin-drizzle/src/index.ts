import './global-types';
import './field-builder';
import './schema-builder';
import { GraphQLFieldResolver } from 'graphql';
import SchemaBuilder, { BasePlugin, PothosOutputFieldConfig, SchemaTypes } from '@pothos/core';
import { getLoaderMapping, setLoaderMappings } from './utils/loader-map';

export * from './types';

const pluginName = 'drizzle';

export default pluginName;

export class PothosDrizzlePlugin<Types extends SchemaTypes> extends BasePlugin<Types> {
  override onOutputFieldConfig(
    fieldConfig: PothosOutputFieldConfig<Types>,
  ): PothosOutputFieldConfig<Types> | null {
    if (fieldConfig.kind === 'DrizzleObject' && fieldConfig.pothosOptions.select) {
      const { select } = fieldConfig.pothosOptions;
      return {
        ...fieldConfig,
        extensions: {
          ...fieldConfig.extensions,
          pothosDrizzleSelect:
            typeof select === 'function'
              ? (
                  args: {},
                  ctx: Types['Context'],
                  nestedQuery: (query: unknown, path?: string[]) => never,
                ) => ({
                  select: (select as (args: unknown, ctx: unknown, nestedQuery: unknown) => {})(
                    args,
                    ctx,
                    nestedQuery,
                  ),
                })
              : select,
        },
      };
    }

    return fieldConfig;
  }

  override wrapResolve(
    resolver: GraphQLFieldResolver<unknown, Types['Context'], object, unknown>,
    fieldConfig: PothosOutputFieldConfig<Types>,
  ): GraphQLFieldResolver<unknown, Types['Context'], object> {
    if (fieldConfig.kind !== 'DrizzleObject' || !fieldConfig.extensions?.pothosDrizzleSelect) {
      return resolver;
    }

    const parentConfig = this.buildCache.getTypeConfig(fieldConfig.parentType);

    const parentTypes = new Set([fieldConfig.parentType]);

    if (parentConfig.kind === 'Interface' || parentConfig.kind === 'Object') {
      parentConfig.interfaces.forEach((iface) => {
        const interfaceConfig = this.buildCache.getTypeConfig(iface, 'Interface');
        if (interfaceConfig.extensions?.pothosDrizzleModel) {
          parentTypes.add(interfaceConfig.name);
        }
      });
    }

    return (parent, args, context, info) => {
      let mapping = getLoaderMapping(context, info.path, info.parentType.name);

      if (!mapping) {
        for (const parentType of parentTypes) {
          mapping = getLoaderMapping(context, info.path, parentType);
          if (mapping) {
            break;
          }
        }
      }

      if (mapping) {
        setLoaderMappings(context, info, mapping);

        return resolver(parent, args, context, info);
      }

      throw new Error(
        `Field ${fieldConfig.name} not resolved in initial query and dataloader not implemented yet`,
      );
    };
  }
}

SchemaBuilder.registerPlugin(pluginName, PothosDrizzlePlugin, {});
