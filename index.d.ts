declare function isUndefined(value: any): boolean;
declare function isNull(value: any): boolean;
declare function isObject(value: any): boolean;
declare function isArray(value: any): boolean;
declare function isDate(value: any): boolean;
declare function isBlob(value: any): boolean;
declare function isFile(value: any): boolean;
declare function isFormData(value: any): boolean;
declare type ParamType = undefined | null;
interface ICfg {
    indices?: boolean;
    nulls?: boolean;
}
declare function objectToFormData(obj: any, cfg?: ICfg | FormData | ParamType, fd?: FormData, pre?: FormData | string): FormData;
declare module 'object-to-formdata';
