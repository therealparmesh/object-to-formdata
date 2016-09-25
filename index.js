"use strict";

function isObj (val) {
  return val === Object(val)
}

function isFile (val) {
  return val instanceof File
}

var objectToFormData = function(obj, fd, prefix) {
  fd = fd || new FormData();
  var key = null;

  Object.keys(obj).forEach(function(prop) {
    key = prefix ? (prefix + "[" + prop + "]") : prop;

    if (isObj(obj[prop]) && !Array.isArray(obj[prop]) && !isFile(obj[prop])) {
      objectToFormData(obj[prop], fd, key);
    } else if (Array.isArray(obj[prop])) {
      obj[prop].forEach(function(value) {
        var newKey = key + '[]'
        if (isObj(value) && !isFile(value)) {
          objectToFormData(value, fd, newKey)
        } else {
          fd.append(newKey, value)
        }
      });
    } else {
      fd.append(key, obj[prop]);
    }
  });

  return fd;
};

module.exports = objectToFormData;
