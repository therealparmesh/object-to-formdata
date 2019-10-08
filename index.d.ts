export = objectToFormData;

declare function objectToFormData(
  obj: any,
  cfg?: {
    indices?: boolean;
    nullsAsUndefineds?: boolean;
    boolToInt?: boolean;
  },
  fd?: FormData,
  pre?: string
): FormData;
