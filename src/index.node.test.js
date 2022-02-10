/**
 * @jest-environment node
 */

const FormData = require('form-data');

const { serialize } = require('.');

const formDataAppend = FormData.prototype.append;

beforeEach(() => {
  FormData.prototype.append = jest.fn(formDataAppend);
});

test('works in nodejs', () => {
  const formData = new FormData();
  serialize(
    {
      foo: 'bar',
    },
    null,
    formData,
  );

  expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
});
