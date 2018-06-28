const objectToFormData = require('..')

beforeEach(() => {
  global.FormData.prototype.append = jest.fn(global.FormData.prototype.append)
})

test('undefined', () => {
  const formData = objectToFormData({
    foo: undefined
  })

  expect(formData.append).not.toHaveBeenCalled()
})

test('null', () => {
  const formData = objectToFormData({
    foo: null
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', '')
  expect(formData.get('foo')).toBe('')
})

test('boolean', () => {
  const formData = objectToFormData({
    foo: true,
    bar: false
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo', true)
  expect(formData.append).toHaveBeenNthCalledWith(2, 'bar', false)
  expect(formData.get('foo')).toBe('true')
  expect(formData.get('bar')).toBe('false')
})

test('number', () => {
  const formData = objectToFormData({
    foo: 1
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', 1)
  expect(formData.get('foo')).toBe('1')
})

test('string', () => {
  const formData = objectToFormData({
    foo: 'bar'
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', 'bar')
  expect(formData.get('foo')).toBe('bar')
})

test('empty string', () => {
  const formData = objectToFormData({
    foo: ''
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', '')
  expect(formData.get('foo')).toBe('')
})

test('Object', () => {
  const formData = objectToFormData({
    foo: {
      bar: 'baz',
      qux: 'quux'
    }
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar]', 'baz')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[qux]', 'quux')
  expect(formData.get('foo[bar]')).toBe('baz')
  expect(formData.get('foo[qux]')).toBe('quux')
})

test('empty Object', () => {
  const formData = objectToFormData({
    foo: {}
  })

  expect(formData.append).not.toHaveBeenCalled()
})

test('Object in Array', () => {
  const formData = objectToFormData({
    foo: [
      {
        bar: 'baz'
      },
      {
        qux: 'quux'
      }
    ]
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][bar]', 'baz')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][qux]', 'quux')
  expect(formData.get('foo[][bar]')).toBe('baz')
  expect(formData.get('foo[][qux]')).toBe('quux')
})

test('Object in Object', () => {
  const formData = objectToFormData({
    foo: {
      bar: {
        baz: {
          qux: 'quux'
        }
      }
    }
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo[bar][baz][qux]', 'quux')
  expect(formData.get('foo[bar][baz][qux]')).toBe('quux')
})

test('Array', () => {
  const formData = objectToFormData({
    foo: [
      'bar',
      'baz'
    ]
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz')
  expect(formData.getAll('foo[]')).toEqual([
    'bar',
    'baz'
  ])
})

test('empty Array', () => {
  const formData = objectToFormData({
    foo: []
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo[]', '')
  expect(formData.get('foo[]')).toBe('')
})

test('Array in Array', () => {
  const formData = objectToFormData({
    foo: [
      [
        [
          'bar',
          'baz'
        ]
      ]
    ]
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][][]', 'bar')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][][]', 'baz')
  expect(formData.getAll('foo[][][]')).toEqual([
    'bar',
    'baz'
  ])
})

test('Array in Object', () => {
  const formData = objectToFormData({
    foo: {
      bar: [
        'baz',
        'qux'
      ]
    }
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar][]', 'baz')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[bar][]', 'qux')
  expect(formData.getAll('foo[bar][]')).toEqual([
    'baz',
    'qux'
  ])
})

test('Array where key ends with "[]"', () => {
  const formData = objectToFormData({
    'foo[]': [
      'bar',
      'baz'
    ]
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz')
  expect(formData.getAll('foo[]')).toEqual([
    'bar',
    'baz'
  ])
})

test('Array with indices option', () => {
  const formData = objectToFormData({
    foo: [
      'bar',
      'baz'
    ]
  }, {
    indices: true
  })

  expect(formData.append).toHaveBeenCalledTimes(2)
  expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[0]', 'bar')
  expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[1]', 'baz')
  expect(formData.get('foo[0]')).toBe('bar')
  expect(formData.get('foo[1]')).toBe('baz')
})

test('Date', () => {
  const foo = new Date(2000, 0, 1, 1, 1, 1)
  const formData = objectToFormData({
    foo
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', foo.toISOString())
  expect(formData.get('foo')).toBe(foo.toISOString())
})

test('File', () => {
  const foo = new File([], '')
  const formData = objectToFormData({
    foo
  })

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', foo)
  expect(formData.get('foo')).toBe(foo)
})

test('FormData instance as second parameter', () => {
  const existingFormData = new FormData()
  const formData = objectToFormData({
    foo: 'bar'
  }, existingFormData)

  expect(formData.append).toHaveBeenCalledTimes(1)
  expect(formData.append).toHaveBeenCalledWith('foo', 'bar')
  expect(formData.get('foo')).toBe('bar')
  expect(formData).toBe(existingFormData)
})
