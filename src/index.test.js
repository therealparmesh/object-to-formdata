import { beforeEach, expect, mock, test } from "bun:test";

import { serialize } from "./index.js";

const formDataAppend = FormData.prototype.append;

beforeEach(() => {
  FormData.prototype.append = mock(formDataAppend);
});

test("undefined", () => {
  const formData = serialize({
    foo: undefined,
  });
  const emptyFormData = serialize();

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
  expect([...emptyFormData]).toEqual([]);
});

test("null", () => {
  const formData = serialize({
    foo: null,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", "");
  expect(formData.get("foo")).toBe("");
});

test("null with nullsAsUndefineds option", () => {
  const formData = serialize(
    {
      foo: null,
    },
    {
      nullsAsUndefineds: true,
    },
  );

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
});

test("boolean", () => {
  const formData = serialize({
    foo: true,
    bar: false,
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", true);
  expect(formData.append).toHaveBeenNthCalledWith(2, "bar", false);
  expect(formData.get("foo")).toBe("true");
  expect(formData.get("bar")).toBe("false");
});

test("boolean with booleansAsIntegers option", () => {
  const formData = serialize(
    {
      foo: true,
      bar: false,
    },
    {
      booleansAsIntegers: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", 1);
  expect(formData.append).toHaveBeenNthCalledWith(2, "bar", 0);
  expect(formData.get("foo")).toBe("1");
  expect(formData.get("bar")).toBe("0");
});

test("integer", () => {
  const formData = serialize({
    foo: 1,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", 1);
  expect(formData.get("foo")).toBe("1");
});

test("float", () => {
  const formData = serialize({
    foo: 1.01,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", 1.01);
  expect(formData.get("foo")).toBe("1.01");
});

test("bigint", () => {
  const formData = serialize({
    foo: 1n,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", 1n);
  expect(formData.get("foo")).toBe("1");
});

test("string", () => {
  const formData = serialize({
    foo: "bar",
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", "bar");
  expect(formData.get("foo")).toBe("bar");
});

test("empty string", () => {
  const formData = serialize({
    foo: "",
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", "");
  expect(formData.get("foo")).toBe("");
});

test("string without key prefix", () => {
  const formData = serialize("foo");

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith(undefined, "foo");
  expect(formData.get("undefined")).toBe("foo");
});

test("symbol", () => {
  const formData = serialize({
    foo: Symbol("bar"),
  });

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
});

test("Object", () => {
  const formData = serialize({
    foo: {
      bar: "baz",
      qux: "quux",
    },
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[bar]", "baz");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[qux]", "quux");
  expect(formData.get("foo[bar]")).toBe("baz");
  expect(formData.get("foo[qux]")).toBe("quux");
});

test("empty Object", () => {
  const formData = serialize({
    foo: {},
  });

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
});

test("Object in Array", () => {
  const formData = serialize({
    foo: [
      {
        bar: "baz",
      },
      {
        qux: "quux",
      },
    ],
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[][bar]", "baz");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[][qux]", "quux");
  expect(formData.get("foo[][bar]")).toBe("baz");
  expect(formData.get("foo[][qux]")).toBe("quux");
});

test("Object in Object", () => {
  const formData = serialize({
    foo: {
      bar: {
        baz: {
          qux: "quux",
        },
      },
    },
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo[bar][baz][qux]", "quux");
  expect(formData.get("foo[bar][baz][qux]")).toBe("quux");
});

test("Object with key prefix", () => {
  const formData = serialize({ foo: "bar" }, undefined, undefined, "prefix");

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("prefix[foo]", "bar");
  expect(formData.get("prefix[foo]")).toBe("bar");
});

test("Object with shared references", () => {
  const value = {
    bar: "baz",
  };
  const formData = serialize({
    foo: value,
    qux: value,
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[bar]", "baz");
  expect(formData.append).toHaveBeenNthCalledWith(2, "qux[bar]", "baz");
  expect(formData.get("foo[bar]")).toBe("baz");
  expect(formData.get("qux[bar]")).toBe("baz");
});

test("Object with Date tag", () => {
  const formData = serialize({
    foo: {
      [Symbol.toStringTag]: "Date",
      value: "bar",
    },
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo[value]", "bar");
  expect(formData.get("foo[value]")).toBe("bar");
});

test("Object with Blob properties", () => {
  const formData = serialize({
    foo: {
      [Symbol.toStringTag]: "Blob",
      size: 1,
      type: "custom",
      slice() {},
      value: "bar",
    },
  });

  expect(formData.append).toHaveBeenCalledTimes(3);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[size]", 1);
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[type]", "custom");
  expect(formData.append).toHaveBeenNthCalledWith(3, "foo[value]", "bar");
  expect(formData.get("foo[size]")).toBe("1");
  expect(formData.get("foo[type]")).toBe("custom");
  expect(formData.get("foo[value]")).toBe("bar");
});

test("Object with circular reference", () => {
  const foo = {};
  foo.bar = foo;

  expect(() => serialize({ foo })).toThrow(
    new TypeError("Cannot serialize circular structure"),
  );
});

test("Object with dotsForObjectNotation option", () => {
  const formData = serialize(
    {
      foo: {
        bar: "baz",
        qux: [
          {
            quux: "corge",
          },
        ],
      },
    },
    {
      dotsForObjectNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo.bar", "baz");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo.qux[].quux", "corge");
  expect(formData.get("foo.bar")).toBe("baz");
  expect(formData.get("foo.qux[].quux")).toBe("corge");
});

test("Array", () => {
  const formData = serialize({
    foo: ["bar", "baz"],
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[]", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[]", "baz");
  expect(formData.getAll("foo[]")).toEqual(["bar", "baz"]);
});

test("Array without key prefix", () => {
  const formData = serialize(["foo"]);

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("undefined[]", "foo");
  expect(formData.get("undefined[]")).toBe("foo");
});

test("Array with noAttributesWithArrayNotation option", () => {
  const formData = serialize(
    {
      foo: ["bar", "baz"],
    },
    {
      noAttributesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo", "baz");
  expect(formData.getAll("foo")).toEqual(["bar", "baz"]);
});

test("empty Array", () => {
  const formData = serialize({
    foo: [],
  });

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
});

test("Array in Array", () => {
  const formData = serialize({
    foo: [[["bar", "baz"]]],
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[][][]", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[][][]", "baz");
  expect(formData.getAll("foo[][][]")).toEqual(["bar", "baz"]);
});

test("Array in Array with noAttributesWithArrayNotation option", () => {
  const formData = serialize(
    {
      foo: [[["bar", "baz"]]],
    },
    {
      noAttributesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo", "baz");
  expect(formData.getAll("foo")).toEqual(["bar", "baz"]);
});

test("Array in Object", () => {
  const formData = serialize({
    foo: {
      bar: ["baz", "qux"],
    },
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[bar][]", "baz");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[bar][]", "qux");
  expect(formData.getAll("foo[bar][]")).toEqual(["baz", "qux"]);
});

test('Array where key ends with "[]"', () => {
  const formData = serialize({
    "foo[]": ["bar", "baz"],
  });

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[]", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[]", "baz");
  expect(formData.getAll("foo[]")).toEqual(["bar", "baz"]);
});

test("Array with indices option", () => {
  const options = {
    indices: true,
  };
  const formData = serialize(
    {
      foo: ["bar", "baz"],
    },
    options,
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[0]", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo[1]", "baz");
  expect(formData.get("foo[0]")).toBe("bar");
  expect(formData.get("foo[1]")).toBe("baz");
  expect(options).toEqual({
    indices: true,
  });
});

test("Array with indices and noAttributesWithArrayNotation option", () => {
  const formData = serialize(
    {
      foo: ["bar", "baz"],
    },
    {
      indices: true,
      noAttributesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", "bar");
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo", "baz");
  expect(formData.get("foo")).toBe("bar");
});

test("Array with allowEmptyArrays option", () => {
  const formData = serialize(
    {
      foo: [],
    },
    {
      allowEmptyArrays: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo[]", "");
  expect(formData.get("foo[]")).toBe("");
});

test("Array with allowEmptyArrays and noAttributesWithArrayNotation options", () => {
  const formData = serialize(
    {
      foo: [],
    },
    {
      allowEmptyArrays: true,
      noAttributesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", "");
  expect(formData.get("foo")).toBe("");
});

test("Date", () => {
  const foo = new Date(2000, 0, 1, 1, 1, 1);
  const formData = serialize({
    foo,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", foo.toISOString());
  expect(formData.get("foo")).toBe(foo.toISOString());
});

test("Date without Date prototype", () => {
  const foo = new Date("2000-01-01T00:00:00.000Z");
  Object.setPrototypeOf(foo, {
    toISOString: Date.prototype.toISOString,
  });
  const formData = serialize({ foo });

  expect(foo instanceof Date).toBe(false);
  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith(
    "foo",
    "2000-01-01T00:00:00.000Z",
  );
  expect(formData.get("foo")).toBe("2000-01-01T00:00:00.000Z");
});

test("Date Proxy", () => {
  const formData = serialize({
    foo: new Proxy(new Date(), {}),
  });

  expect(formData.append).not.toHaveBeenCalled();
  expect(formData.get("foo")).toBe(null);
});

test("File", () => {
  const foo = new File([], "");
  const formData = serialize({
    foo,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", foo);
  expect(formData.get("foo")).toEqual(foo);
});

test("File with noFilesWithArrayNotation option", () => {
  const bar = new File([], "");
  const baz = new File([], "");
  const foo = [bar, baz, "qux"];
  const formData = serialize(
    {
      foo,
    },
    {
      noFilesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(3);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", bar);
  expect(formData.append).toHaveBeenNthCalledWith(2, "foo", baz);
  expect(formData.append).toHaveBeenNthCalledWith(3, "foo[]", "qux");
  expect(formData.getAll("foo")).toEqual([bar, baz]);
  expect(formData.getAll("foo[]")).toEqual(["qux"]);
});

test("File with noAttributesWithArrayNotation option", () => {
  const foo = new File([], "foo.txt");
  const formData = serialize(
    {
      foo: [foo],
    },
    {
      noAttributesWithArrayNotation: true,
    },
  );

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo[]", foo);
  expect(formData.get("foo[]")).toEqual(foo);
});

test("File in Array in Array with noFilesWithArrayNotation option", () => {
  const foo = new File([], "foo.txt");
  const options = {
    noFilesWithArrayNotation: true,
  };
  const formData = serialize(
    {
      foo: [[foo]],
    },
    options,
  );
  const rootFormData = serialize([[foo]], options);

  expect(formData.append).toHaveBeenCalledTimes(2);
  expect(formData.append).toHaveBeenNthCalledWith(1, "foo", foo);
  expect(formData.append).toHaveBeenNthCalledWith(2, undefined, foo);
  expect(formData.get("foo")).toEqual(foo);
  expect(rootFormData.get("undefined")).toEqual(foo);
});

test("Blob", () => {
  const foo = new Blob([]);
  const formData = serialize({
    foo,
  });

  expect(formData.append).toHaveBeenCalledTimes(1);
  expect(formData.append).toHaveBeenCalledWith("foo", foo);
  expect(formData.get("foo")).toEqual(new File([], ""));
});

test("Blob without Blob constructor", () => {
  const BlobConstructor = Blob;
  const foo = {
    size: 0,
    type: "",
    slice() {},
  };

  globalThis.Blob = undefined;

  try {
    const formData = serialize({ foo });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith("foo", foo);
    expect(formData.get("foo")).toBe("[object Object]");
  } finally {
    globalThis.Blob = BlobConstructor;
  }
});

test("React Native Blob", () => {
  const foo = {
    uri: "content://...",
  };
  const formData = new FormData();
  formData.getParts = () => {};
  const result = serialize({ foo }, undefined, formData);

  expect(result).toBe(formData);
  expect(result.append).toHaveBeenCalledTimes(1);
  expect(result.append).toHaveBeenCalledWith("foo", foo);
  expect(result.get("foo")).toBe("[object Object]");
});
