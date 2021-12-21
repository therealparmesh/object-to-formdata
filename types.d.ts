export type Options = {
  indices?: boolean;
  nullsAsUndefineds?: boolean;
  booleansAsIntegers?: boolean;
  allowEmptyArrays?: boolean;
  noFilesWithArrayNotation?: boolean;
  dotsForObjectNotation?: boolean;
};

export function serialize<T = {}>(
  object: T,
  options?: Options,
  existingFormData?: FormData,
  keyPrefix?: string,
): FormData;
