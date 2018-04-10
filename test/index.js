import test from 'ava'
import sinon from 'sinon'
import jsdom from 'jsdom'

global.window = (new jsdom.JSDOM()).window

require('formdata-polyfill')

global.Blob = global.window.Blob
global.File = global.window.File
global.FormData = class FormData {
  constructor () {
    this.$ = new global.window.FormData()
    this.get = this.$.get.bind(this.$)
    this.getAll = this.$.getAll.bind(this.$)
    this.append = sinon.spy(this.$.append.bind(this.$))
  }
}

const objectToFormData = require('..')


test('undefined', t => {
  const formData = objectToFormData({
    foo: undefined
  })

  t.true(formData.append.notCalled)
})

test('null', t => {
  const formData = objectToFormData({
    foo: null
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    null
  ])
  t.is(formData.get('foo'), 'null')
})

test('boolean', t => {
  const formData = objectToFormData({
    foo: true,
    bar: false
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    true
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'bar',
    false
  ])
  t.is(formData.get('foo'), 'true')
  t.is(formData.get('bar'), 'false')
})

test('number', t => {
  const formData = objectToFormData({
    foo: 1
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    1
  ])
  t.is(formData.get('foo'), '1')
})

test('not a number', t => {
  const formData = objectToFormData({
    foo: NaN
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    NaN
  ])
  t.is(formData.get('foo'), 'NaN')
})

test('string', t => {
  const formData = objectToFormData({
    foo: 'bar'
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    'bar'
  ])
  t.is(formData.get('foo'), 'bar')
})

test('empty string', t => {
  const formData = objectToFormData({
    foo: ''
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    ''
  ])
  t.is(formData.get('foo'), '')
})

test('Blob', t => {
  const foo = new Blob([])
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo
  ])
  t.deepEqual(formData.get('foo'), new File([foo], ''))
})

test('ReactNative "blob"', t => {
  const FormDataOrig = global.FormData
  global.FormData = class FormData {
    constructor () {
      this.$ = new global.window.FormData()
      this.get = this.$.get.bind(this.$)
      this.getAll = this.$.getAll.bind(this.$)
      this.getParts = function(){}
      this.append = sinon.spy(this.$.append.bind(this.$))
    }
  }

  const foo = {uri: 'content://...'}
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo
  ])
  t.deepEqual(formData.get('foo'), '[object Object]')

  global.FormData = FormDataOrig
})

test('File', t => {
  const foo = new File([], {})
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo
  ])
  t.is(formData.get('foo'), foo)
})

test('Date', t => {
  const foo = new Date()
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo.toISOString()
  ])
  t.is(formData.get('foo'), foo.toISOString())
})

test('Object', t => {
  const formData = objectToFormData({
    foo: {
      bar: 'baz',
      qux: 'quux'
    }
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[bar]',
    'baz'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[qux]',
    'quux'
  ])
  t.is(formData.get('foo[bar]'), 'baz')
  t.is(formData.get('foo[qux]'), 'quux')
})

test('empty Object', t => {
  const formData = objectToFormData({
    foo: {}
  })

  t.true(formData.append.notCalled)
})

test('Object in Array', t => {
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

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[][bar]',
    'baz'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[][qux]',
    'quux'
  ])
  t.is(formData.get('foo[][bar]'), 'baz')
  t.is(formData.get('foo[][qux]'), 'quux')
})

test('Object in Object', t => {
  const formData = objectToFormData({
    foo: {
      bar: {
        baz: {
          qux: 'quux'
        }
      }
    }
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[bar][baz][qux]',
    'quux'
  ])
  t.is(formData.get('foo[bar][baz][qux]'), 'quux')
})

test('Array', t => {
  const formData = objectToFormData({
    foo: [
      'bar',
      'baz'
    ]
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[]',
    'bar'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[]',
    'baz'
  ])
  t.deepEqual(formData.getAll('foo[]'), [
    'bar',
    'baz'
  ])
})

test('empty Array', t => {
  const formData = objectToFormData({
    foo: []
  })

  t.true(formData.append.notCalled)
})

test('Array in Array', t => {
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

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[][][]',
    'bar'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[][][]',
    'baz'
  ])
  t.deepEqual(formData.getAll('foo[][][]'), [
    'bar',
    'baz'
  ])
})

test('Array in Object', t => {
  const formData = objectToFormData({
    foo: {
      bar: [
        'baz',
        'qux'
      ]
    }
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[bar][]',
    'baz'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[bar][]',
    'qux'
  ])
  t.deepEqual(formData.getAll('foo[bar][]'), [
    'baz',
    'qux'
  ])
})

test('Array where key ends with "[]"', t => {
  const formData = objectToFormData({
    'foo[]': [
      'bar',
      'baz'
    ]
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[]',
    'bar'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[]',
    'baz'
  ])
  t.deepEqual(formData.getAll('foo[]'), [
    'bar',
    'baz'
  ])
})

test('Array with indices option', t => {
  const formData = objectToFormData({
    foo: [
      'bar',
      'baz'
    ]
  }, {
    indices: true
  })

  t.true(formData.append.calledTwice)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo[0]',
    'bar'
  ])
  t.deepEqual(formData.append.getCall(1).args, [
    'foo[1]',
    'baz'
  ])
  t.deepEqual(formData.get('foo[0]'), 'bar')
  t.deepEqual(formData.get('foo[1]'), 'baz')
})

test('Date', t => {
  const foo = new Date(2000, 0, 1, 1, 1, 1)
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo.toISOString()
  ])
  t.is(formData.get('foo'), foo.toISOString())
})

test('File', t => {
  const foo = new File([], '')
  const formData = objectToFormData({
    foo
  })

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    foo
  ])
  t.is(formData.get('foo'), foo)
})

test('FormData instance as second parameter', t => {
  const existingFormData = new FormData()
  const formData = objectToFormData({
    foo: 'bar'
  }, existingFormData)

  t.true(formData.append.calledOnce)
  t.deepEqual(formData.append.getCall(0).args, [
    'foo',
    'bar'
  ])
  t.is(formData.get('foo'), 'bar')
  t.is(formData, existingFormData)
})
