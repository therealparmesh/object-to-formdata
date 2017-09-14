# object-to-formdata
  A convenient client-side JavaScript function to create a FormData instance from the key-value pairs of an Object instance.

```
const objectToFormData = require('object-to-formdata')


const object = {
  /**
   * key-value pairs
   * values can be primitives or objects
   */
}

const formData = objectToFormData(object)

console.log(formData)
```
