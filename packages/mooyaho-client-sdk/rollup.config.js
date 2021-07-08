import typescript from '@rollup/plugin-typescript'

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/cjs/bundle.js',
    },
    {
      format: 'es',
      file: 'dist/es/bundle.js',
    },
  ],
  plugins: [typescript({ module: 'ESNext' })],
}
