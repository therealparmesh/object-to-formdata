const isUndefined = value => value === undefined

const isNull = value => value === null

const isObject = value => value === Object(value)

const isArray = value => Array.isArray(value)

const isDate = value => value instanceof Date

const isBoolean = value => typeof value === 'boolean'

const isBlob = value =>
  value &&
  typeof value.size === 'number' &&
  typeof value.type === 'string' &&
  typeof value.slice === 'function'

const isFile = value =>
  isBlob(value) &&
  typeof value.name === 'string' &&
  (typeof value.lastModifiedDate === 'object' ||
    typeof value.lastModified === 'number')

const objectToFormData = (obj, cfg, fd, pre) => {
  cfg = cfg || {}
  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices
  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds) ? false : cfg.nullsAsUndefineds
  cfg.boolToInt = isUndefined(cfg.boolToInt) ? false : cfg.boolToInt
  fd = fd || new FormData()

  if (isUndefined(obj)) {
    return fd
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '')
    }
  } else if (isArray(obj)) {
    if (!obj.length) {
      const key = pre + '[]'

      fd.append(key, '')
    } else {
      obj.forEach((value, index) => {
        const key = pre + '[' + (cfg.indices ? index : '') + ']'

        objectToFormData(value, cfg, fd, key)
      })
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString())
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach(prop => {
      const value = obj[prop]

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2)
        }
      }

      const key = pre ? pre + '[' + prop + ']' : prop

      objectToFormData(value, cfg, fd, key)
    })
  } else if (isBoolean(obj)) {
    if (cfg.boolToInt) {
      fd.append(pre, obj ? '1' : '0')
    } else {
      fd.append(pre, obj)
    }
  } else {
    fd.append(pre, obj)
  }

  return fd
}

export default objectToFormData
