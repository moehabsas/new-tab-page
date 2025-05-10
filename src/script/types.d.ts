/**
 * A generic Dictionary type that maps string keys to values of a specified type.
 * - By default, the value type is `string` if no type is explicitly provided.
 */
declare type Dictionary<T = string> = { [key: string]: T };
