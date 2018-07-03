# object-to-formdata

[![npm](https://img.shields.io/npm/v/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)
[![npm](https://img.shields.io/npm/dt/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)

`object-to-formdata` is a convenient JavaScript function that converts an object to a FormData instance.

```js
const objectToFormData = require('object-to-formdata')

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
}

const options = {
  /**
   * whether or not to include array indices in FormData keys
   * defaults to false
   */
  indices: false
}

const formData = objectToFormData(
  object,
  options, // optional
  existingFormData, // optional
  keyPrefix // optional
)

console.log(formData)
```
