export type ConvertOptions = {
  indices?: boolean;
  nullsAsUndefineds?: boolean;
  booleansAsIntegers?: boolean;
};

export const objectToFormData: <T>(
  object: T,
  options?: ConvertOptions,
  existingFormData?: FormData,
  keyPrefix?: string,
) => FormData;
