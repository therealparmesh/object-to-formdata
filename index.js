'use strict'

function isUndefined (value) {
  return value === undefined
}

function isObject (value) {
  return value === Object(value)
}

function isArray (value) {
  return Array.isArray(value)
}

/**
 * React Native "blob": an object with a `uri` attribute. Optionally, it can
 * also have a `name` and `type` attribute to specify filename and content type
 *
 * @see https://github.com/facebook/react-native/blob/26684cf3adf4094eb6c405d345a75bf8c7c0bf88/Libraries/Network/FormData.js#L68-L71
 */
function isReactNativeBlob (value) {
  return value && typeof value.uri !== 'undefined'
}

const isBlob = typeof Blob !== 'undefined' ?
function (value, isReactNative) {
  return value instanceof Blob
    || isReactNative && isReactNativeBlob(value)
} :
function (value, isReactNative) {
  return value != null &&
      typeof value.size === 'number' &&
      typeof value.type === 'string' &&
      typeof value.slice === 'function'
    || isReactNative && isReactNativeBlob(value)
}

function isDate (value) {
  return value instanceof Date
}

function isFormData (value) {
  return value instanceof FormData
}

function objectToFormData (obj, cfg, fd, pre) {
  if (isFormData(cfg)) {
    pre = fd
    fd = cfg
    cfg = null
  }

  cfg = cfg || {}
  cfg.indices = cfg.indices || false
  fd = fd || new FormData()

  // ReactNative `FormData` has a non-standard `getParts()` method
  const isReactNative = typeof fd.getParts !== 'undefined'

  if (isUndefined(obj)) {
    return fd
  } else if (isArray(obj)) {
    obj.forEach(function (value, index) {
      var key = pre + '[' + (cfg.indices ? index : '') + ']'

      objectToFormData(value, cfg, fd, key)
    })
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString())
  } else if (isObject(obj) && !isBlob(obj, isReactNative)) {
    Object.keys(obj).forEach(function (prop) {
      var value = obj[prop]

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2)
        }
      }

      var key = pre ? (pre + '[' + prop + ']') : prop

      objectToFormData(value, cfg, fd, key)
    })
  } else {
    fd.append(pre, obj)
  }

  return fd
}

module.exports = objectToFormData
