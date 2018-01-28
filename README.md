# object-to-formdata
  A convenient JavaScript function that converts an object to a FormData instance.

```
const objectToFormData = require('object-to-formdata')

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
}

const formData = objectToFormData(object)

console.log(formData)
```
