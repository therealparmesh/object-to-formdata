# object-to-formdata
  A convenient client-side JavaScript function to create a FormData instance from the key-value pairs of an Object instance.

```
var objectToFormData = require('object-to-formdata');
var object = { /* key-value pairs (values can be primitives or objects) */ };
var formData = objectToFormData(object);
```
