"use strict";

var objectToFormData = function(obj, fd, prefix) {
  fd = fd || new FormData();
  var key = null;

  Object.keys(obj).forEach(function(prop) {
    key = prefix ? (prefix + "[" + prop + "]") : prop;

    if (obj[prop] === Object(obj[prop]) && !Array.isArray(obj[prop]) && !(obj[prop] instanceof File)) {
      objectToFormData(obj[prop], fd, key);
    } else if (Array.isArray(obj[prop])) {
      obj[prop].forEach(function(value) {
        return fd.append(key + "[]", value);
      });
    } else {
      fd.append(key, obj[prop]);
    }
  });

  return fd;
};

module.exports = objectToFormData;
