function isUndefined(value) {
  return value === undefined;
}

function isNull(value) {
  return value === null;
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isSymbol(value) {
  return typeof value === "symbol";
}

function isObject(value) {
  return value === Object(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isDate(value) {
  if (!isObject(value)) {
    return false;
  }

  try {
    Date.prototype.getTime.call(value);
    return true;
  } catch {
    return false;
  }
}

function isBlob(value, isReactNative) {
  if (isReactNative) {
    return isObject(value) && !isUndefined(value.uri);
  }

  if (
    !isObject(value) ||
    typeof value.size !== "number" ||
    typeof value.type !== "string" ||
    typeof value.slice !== "function"
  ) {
    return false;
  }

  if (typeof Blob === "undefined") {
    return true;
  }

  if (value instanceof Blob) {
    return true;
  }

  try {
    Blob.prototype.slice.call(value, 0, 0);
    return true;
  } catch {
    return false;
  }
}

function isFile(value, isReactNative) {
  return (
    (typeof File !== "undefined" && value instanceof File) ||
    (isBlob(value, isReactNative) &&
      typeof value.name === "string" &&
      (isObject(value.lastModifiedDate) ||
        typeof value.lastModified === "number"))
  );
}

function serialize(obj, cfg, fd, pre, seen, arrayKey) {
  cfg = cfg || {};
  fd = fd || new FormData();
  seen = seen || new WeakSet();

  const isReactNative = typeof fd.getParts === "function";
  const date = isDate(obj);

  const traversable =
    isArray(obj) || (isObject(obj) && !date && !isBlob(obj, isReactNative));

  if (traversable) {
    if (seen.has(obj)) {
      throw new TypeError("Cannot serialize circular structure");
    }

    seen.add(obj);
  }

  if (isUndefined(obj) || isSymbol(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, "");
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    const rootKey = arguments.length > 5 ? arrayKey : pre;

    if (obj.length) {
      obj.forEach((value, index) => {
        let key = pre + "[" + (cfg.indices ? index : "") + "]";
        const file = isFile(value, isReactNative);

        if (cfg.noFilesWithArrayNotation && file) {
          key = rootKey;
        } else if (cfg.noAttributesWithArrayNotation && !file) {
          key = pre;
        }

        serialize(
          value,
          cfg,
          fd,
          key,
          seen,
          isArray(value) ? rootKey : undefined,
        );
      });
    } else if (cfg.allowEmptyArrays) {
      fd.append(cfg.noAttributesWithArrayNotation ? pre : pre + "[]", "");
    }
  } else if (date) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf("[]") === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }

      const key = pre
        ? cfg.dotsForObjectNotation
          ? pre + "." + prop
          : pre + "[" + prop + "]"
        : prop;

      serialize(value, cfg, fd, key, seen);
    });
  } else {
    fd.append(pre, obj);
  }

  if (traversable) {
    seen.delete(obj);
  }

  return fd;
}

export { serialize };
