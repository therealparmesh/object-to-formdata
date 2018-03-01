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

const isBlob = typeof Blob === 'undefined' ?
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

const isFile = typeof File === 'undefined' ?
function (value, isReactNative) {
  return value instanceof File
    || isReactNative && isReactNativeBlob(value)
} :
function (value, isReactNative) {
  return isBlob(value) &&
      typeof value.lastModified === 'number' &&
      typeof value.name === 'string'
    || isReactNative && isReactNativeBlob(value)
}

function isDate (value) {
  return value instanceof Date
}

function objectToFormData (obj, fd, pre) {
  fd = fd || new FormData()

  // ReactNative `FormData` has a non-standard `getParts()` method
  const isReactNative = typeof fd.getParts !== 'undefined'

  if (isUndefined(obj)) {
    return fd
  } else if (isArray(obj)) {
    obj.forEach(function (value) {
      var key = pre + '[]'

      objectToFormData(value, fd, key)
    })
  } else if (isObject(obj) && !isFile(obj, isReactNative) && !isDate(obj)) {
    Object.keys(obj).forEach(function (prop) {
      var value = obj[prop]

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2)
        }
      }

      var key = pre ? (pre + '[' + prop + ']') : prop

      objectToFormData(value, fd, key)
    })
  } else {
    fd.append(pre, obj)
  }

  return fd
}

module.exports = objectToFormData
