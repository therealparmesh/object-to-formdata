'use strict'

function isObject (value) {
  return value === Object(value)
}

function isArray (value) {
  return Array.isArray(value)
}

function isBlob (value) {
  return value != null
      && typeof value.size === 'number'
      && typeof value.type === 'string'
      && typeof value.slice === 'function'
}

function isFile (value) {
  return isBlob(value)
      && typeof value.lastModified === 'number'
      && typeof value.name === 'string'
}

function isUndefined (value) {
  return value === undefined
}

function makeArrayKey (key) {
  if (key.length > 2 && key.lastIndexOf('[]') === key.length - 2) {
    return key
  } else {
    return key + '[]'
  }
}

function objectToFormData (obj, fd, pre) {
  fd = fd || new FormData()

  Object.keys(obj).forEach(function (prop) {
    var key = pre ? (pre + '[' + prop + ']') : prop

    if (isUndefined(obj[prop])) return;

    if (isObject(obj[prop]) && !isArray(obj[prop]) && !isFile(obj[prop])) {
      objectToFormData(obj[prop], fd, key)
    } else if (isArray(obj[prop])) {
      obj[prop].forEach(function (value) {
        var arrayKey = makeArrayKey(key)

        if (isObject(value) && !isFile(value)) {
          objectToFormData(value, fd, arrayKey)
        } else {
          fd.append(arrayKey, value)
        }
      })
    } else {
      fd.append(key, obj[prop])
    }
  })

  return fd
}

module.exports = objectToFormData
