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

function isBlob (value) {
  return value != null &&
      typeof value.size === 'number' &&
      typeof value.type === 'string' &&
      typeof value.slice === 'function'
}

function isFile (value) {
  return isBlob(value) &&
      typeof value.lastModified === 'number' &&
      typeof value.name === 'string'
}

function isDate (value) {
  return value instanceof Date
}

function objectToFormData (obj, cfg, fd, pre) {
  cfg = cfg || {}
  cfg.indices = cfg.indices || false
  fd = fd || new FormData()

  if (isUndefined(obj)) {
    return fd
  } else if (isArray(obj)) {
    obj.forEach(function (value, index) {
      var key = pre + '[' + (cfg.indices ? index : '') + ']'

      objectToFormData(value, cfg, fd, key)
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

      objectToFormData(value, cfg, fd, key)
    })
  } else {
    fd.append(pre, obj)
  }

  return fd
}

module.exports = objectToFormData
