# object-to-formdata

[![npm](https://img.shields.io/npm/v/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)
[![npm](https://img.shields.io/npm/dt/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)

`object-to-formdata` is a convenient JavaScript function that converts an object to a FormData instance.

```js
const objectToFormData = require('object-to-formdata');

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
};

const options = {
  /**
   * whether or not to include array indices in FormData keys
   * defaults to false
   */
  indices: false,

  /**
   * whether or not to include null values as empty strings in FormData instance
   * defaults to true
   */
  nulls: true
};

const formData = objectToFormData(
  object,
  options, // optional
  existingFormData, // optional
  keyPrefix // optional
);

console.log(formData);
```

Practical ES6 Vue Axios example for PHP (and others). If you would like to receive data 
in proper associate array format set option incides to true.
```vue
<template>

    <div>
        {{uploading ? 'UPLOADING' : ''}}
        <button @click="sendMessage">Send message</button>
    </div>

</template>

<script>

    import axios from 'axios';
    import objectToFormData from 'object-to-formdata';

    export default {

        methods: {
            data() {
                return {
                    uploading: false
                }
            },
            sendMessage() {
                import objectToFormData from 'object-to-formdata';

                const message = {
                    message: 'It is sunny today!',
                    comments: [
                        {
                            id: 1,
                            comment: 'Not here in Seattle!'
                        },
                        {
                            id: 2,
                            comment: 'It is always sunny if florida'
                        }
                    ]
                };

                const options = {
                    indices: true
                };

                let formData = objectToFormData(message, options);

                this.uploading = true;

                axios.put('/messages', formData)
                    .then((response) => {
                        // Handle success
                    })
                    .catch((error) => {
                        // Handle errors
                    })
                    .finally(() => {
                        this.uploading = false;
                    });
            }
        }
    }

</script>

```