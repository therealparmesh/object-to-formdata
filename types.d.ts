export type Options = {
  indices?: boolean;
  nullsAsUndefineds?: boolean;
  booleansAsIntegers?: boolean;
  allowEmptyArrays?: boolean;
  dotNotation?: boolean;
};

export const serialize: <T = {}>(
  object: T,
  options?: Options,
  existingFormData?: FormData,
  keyPrefix?: string,
) => FormData;
