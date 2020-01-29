export const objectToFormData: (
  obj: any,
  cfg?: {
    indices?: boolean;
    nullsAsUndefineds?: boolean;
    booleansAsIntegers?: boolean;
  },
  fd?: FormData,
  pre?: string,
) => FormData;
