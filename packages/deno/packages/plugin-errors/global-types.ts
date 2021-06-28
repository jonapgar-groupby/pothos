// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FieldNullability, InputFieldMap, SchemaTypes, ShapeFromTypeParam, TypeParam, } from '../core/index.ts';
import { ErrorFieldOptions, ErrorsPluginOptions } from './types.ts';
import { GiraphQLErrorsPlugin } from './index.ts';
declare global {
    export namespace GiraphQLSchemaTypes {
        export interface Plugins<Types extends SchemaTypes> {
            errors: GiraphQLErrorsPlugin<Types>;
        }
        export interface SchemaBuilderOptions<Types extends SchemaTypes> {
            errorOptions?: ErrorsPluginOptions;
        }
        export interface FieldOptions<Types extends SchemaTypes = SchemaTypes, ParentShape = unknown, Type extends TypeParam<Types> = TypeParam<Types>, Nullable extends FieldNullability<Type> = FieldNullability<Type>, Args extends InputFieldMap = InputFieldMap, ResolveShape = unknown, ResolveReturnShape = unknown> {
            errors?: ErrorFieldOptions<Types, Type, ShapeFromTypeParam<Types, Type, false>, Nullable>;
        }
    }
}
