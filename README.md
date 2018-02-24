# object-to-formdata
A convenient JavaScript function that converts an object to a FormData instance

```js
const objectToFormData = require('object-to-formdata')

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
}

const options = {
  indices: false
}

const formData = objectToFormData(object, options)

console.log(formData)
```
