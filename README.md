# object-to-formdata

[![npm version](https://img.shields.io/npm/v/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)
[![npm downloads](https://img.shields.io/npm/dt/object-to-formdata.svg)](https://www.npmjs.com/package/object-to-formdata)
[![Bun CI](https://github.com/therealparmesh/object-to-formdata/actions/workflows/bun.yaml/badge.svg)](https://github.com/therealparmesh/object-to-formdata/actions/workflows/bun.yaml)
[![license](https://img.shields.io/npm/l/object-to-formdata.svg)](LICENSE)

Serialize JavaScript objects into `FormData`. Supports nested objects, arrays,
dates, files, blobs, and configurable key formatting with no runtime
dependencies.

## Installation

```sh
npm install object-to-formdata
```

Other package managers:

```sh
yarn add object-to-formdata
pnpm add object-to-formdata
bun add object-to-formdata
```

## Usage

```js
import { serialize } from "object-to-formdata";

const formData = serialize({
  name: "Ada",
  active: true,
  tags: ["admin", "editor"],
  profile: {
    age: 36,
  },
});

formData.get("name"); // "Ada"
formData.getAll("tags[]"); // ["admin", "editor"]
formData.get("profile[age]"); // "36"
```

CommonJS is also supported:

```js
const { serialize } = require("object-to-formdata");
```

TypeScript declarations are included with the package.

## API

### `serialize(object?, options?, existingFormData?, keyPrefix?)`

Serializes a value and returns a `FormData` instance.

#### `object`

The value to serialize. Objects and arrays are traversed recursively. Dates are
converted to ISO strings, while `File` and `Blob` values are appended directly.
`undefined` and symbol values are ignored.

Circular structures throw a `TypeError`.

#### `options`

| Option                          | Default | Description                                               |
| ------------------------------- | ------- | --------------------------------------------------------- |
| `indices`                       | `false` | Include array indices, such as `items[0]`.                 |
| `nullsAsUndefineds`             | `false` | Ignore `null` values instead of appending an empty string. |
| `booleansAsIntegers`            | `false` | Serialize booleans as `1` or `0`.                         |
| `allowEmptyArrays`              | `false` | Append an empty string for empty arrays.                   |
| `noAttributesWithArrayNotation` | `false` | Omit array notation from non-file array keys.              |
| `noFilesWithArrayNotation`      | `false` | Omit array notation from file array keys.                  |
| `dotsForObjectNotation`         | `false` | Use dots instead of brackets for nested object keys.       |

```js
const formData = serialize(
  {
    users: [{ name: "Ada" }, { name: "Grace" }],
  },
  {
    indices: true,
    dotsForObjectNotation: true,
  },
);

formData.get("users[0].name"); // "Ada"
```

#### `existingFormData`

An existing `FormData` instance to append to. The same instance is returned.

```js
const formData = new FormData();
formData.append("token", "abc123");

serialize({ name: "Ada" }, undefined, formData);
```

#### `keyPrefix`

An optional prefix for generated keys.

```js
const formData = serialize({ name: "Ada" }, undefined, undefined, "user");

formData.get("user[name]"); // "Ada"
```

## Runtime requirements

The runtime must provide `FormData`, either globally or through the
`existingFormData` argument. Modern browsers and supported Node.js releases
provide a global implementation.

## Development

Run the test suite:

```sh
bun run test
```

Inspect the package contents before publishing:

```sh
bun pm pack --dry-run
```

## License

[MIT](LICENSE)
