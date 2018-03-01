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

const isBlob = typeof Blob === 'undefined' ?
function (value) {
  return value instanceof Blob
} :
function (value) {
  return value != null &&
      typeof value.size === 'number' &&
      typeof value.type === 'string' &&
      typeof value.slice === 'function'
}

const isFile = typeof File === 'undefined' ?
function (value) {
  return value instanceof File
} :
function (value) {
  return isBlob(value) &&
      typeof value.lastModified === 'number' &&
      typeof value.name === 'string'
}

function isDate (value) {
  return value instanceof Date
}

function objectToFormData (obj, fd, pre) {
  fd = fd || new FormData()

  if (isUndefined(obj)) {
    return fd
  } else if (isArray(obj)) {
    obj.forEach(function (value) {
      var key = pre + '[]'

      objectToFormData(value, fd, key)
    })
  } else if (isObject(obj) && !isFile(obj) && !isDate(obj)) {
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
