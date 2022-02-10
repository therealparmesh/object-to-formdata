# object-to-formdata

> Convenient JavaScript function that serializes Objects to FormData instances.

[![npm](https://img.shields.io/npm/v/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)
[![npm](https://img.shields.io/npm/dt/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)

## Install

```sh
npm install object-to-formdata
```

## Usage

**NOTE: STARTING WITH VERSION 4.0.0, THE NAMED EXPORT HAS CHANGED!**

**NOTE: STARTING WITH VERSION 3.0.0, THERE IS NO DEFAULT EXPORT!**

```js
import { serialize } from 'object-to-formdata';

const object = {
  /**
   * key-value mapping
   * values can be primitives or objects
   */
};

const options = {
  /**
   * include array indices in FormData keys
   * defaults to false
   */
  indices: false,

  /**
   * treat null values like undefined values and ignore them
   * defaults to false
   */
  nullsAsUndefineds: false,

  /**
   * convert true or false to 1 or 0 respectively
   * defaults to false
   */
  booleansAsIntegers: false,

  /**
   * store arrays even if they're empty
   * defaults to false
   */
  allowEmptyArrays: false,

  /**
   * don't include array notation in FormData keys for Files in arrays
   * defaults to false
   */
  noFilesWithArrayNotation: false,

  /**
   * use dots instead of brackets for object notation in FormData keys
   * defaults to false
   */
  dotsForObjectNotation: false,
};

const formData = serialize(
  object,
  options, // optional
  existingFormData, // optional: allows you to send an existing FormData instance to be used
  keyPrefix, // optional: prefix all keys with this value
);

console.log(formData);
```

## Usage in Node.js

```js
const FormData = require('form-data');

const object = { foo: [1, 2, 3] };

const formData = serialize(object, undefined, new FormData());

console.log(formData);
```
