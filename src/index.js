const isUndefined = (value) => value === undefined;

const isNull = (value) => value === null;

const isBoolean = (value) => typeof value === 'boolean';

const isObject = (value) => value === Object(value);

const isArray = (value) => Array.isArray(value);

const isDate = (value) => value instanceof Date;

/**
 * React Native "blob": an object with a `uri` attribute. Optionally, it can
 * also have a `name` and `type` attribute to specify filename and content type
 *
 * @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
 */
function isReactNativeBlob(value) {
  return value && typeof value.uri !== 'undefined';
}

const isStandardBlob =
  typeof Blob !== 'undefined'
    ? (value) => value instanceof Blob
    : (value) =>
        value &&
        typeof value.size === 'number' &&
        typeof value.type === 'string' &&
        typeof value.slice === 'function';

const isBlob = (value, isReactNative) =>
  isStandardBlob(value) || (isReactNative && isReactNativeBlob(value));

function isFormData(value) {
  return value instanceof FormData;
}

const serialize = (obj, cfg, fd, pre) => {
  if (isFormData(cfg)) {
    pre = fd;
    fd = cfg;
    cfg = null;
  }

  cfg = cfg || {};

  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;

  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds)
    ? false
    : cfg.nullsAsUndefineds;

  cfg.booleansAsIntegers = isUndefined(cfg.booleansAsIntegers)
    ? false
    : cfg.booleansAsIntegers;

  cfg.allowEmptyArrays = isUndefined(cfg.allowEmptyArrays)
    ? false
    : cfg.allowEmptyArrays;

  fd = fd || new FormData();

  // ReactNative `FormData` has a non-standard `getParts()` method
  const isReactNative = typeof fd.getParts !== 'undefined';

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value, index) => {
        const key = pre + '[' + (cfg.indices ? index : '') + ']';

        serialize(value, cfg, fd, key);
      });
    } else if (cfg.allowEmptyArrays) {
      fd.append(pre + '[]', '');
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }

      const key = pre ? pre + '[' + prop + ']' : prop;

      serialize(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
};

module.exports = {
  serialize,
};
