import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/umd.js',
      name: 'objectToFormData',
      format: 'umd',
      sourcemap: true
    }
  ],
  plugins: [babel(), terser()]
}
