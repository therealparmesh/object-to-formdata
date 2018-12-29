'use strict';

function isUndefined(value) {
  return value === undefined;
}

function isNull(value) {
  return value === null;
}

function isObject(value) {
  return value === Object(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isDate(value) {
  return value instanceof Date;
}

function isBlob(value) {
  return (
    value &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.slice === 'function'
  );
}

function isFile(value) {
  return (
    isBlob(value) &&
    (typeof value.lastModifiedDate === 'object' ||
      typeof value.lastModified === 'number') &&
    typeof value.name === 'string'
  );
}

function isFormData(value) {
  return value instanceof FormData;
}

function objectToFormData(obj, cfg, fd, pre) {
  if (isFormData(cfg)) {
    pre = fd;
    fd = cfg;
    cfg = null;
  }

  cfg = cfg || {};
  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;
  cfg.nulls = isUndefined(cfg.nulls) ? true : cfg.nulls;
  fd = fd || new FormData();

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (cfg.nulls) {
      fd.append(pre, '');
    }
  } else if (isArray(obj)) {
    if (!obj.length) {
      var key = pre + '[]';

      fd.append(key, '');
    } else {
      obj.forEach(function(value, index) {
        var key = pre + '[' + (cfg.indices ? index : '') + ']';

        objectToFormData(value, cfg, fd, key);
      });
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach(function(prop) {
      var value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }

      var key = pre ? pre + '[' + prop + ']' : prop;

      objectToFormData(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
}

module.exports = objectToFormData;
