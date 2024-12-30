import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'
import pkg from './package.json' assert { type: 'json' }

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: './dist/' + pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: './dist/' + pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    copy({
      targets: [
        { src: './package.json', dest: 'dist' },
        { src: './LICENCE.txt', dest: 'dist' },
        { src: './README.md', dest: 'dist' }
      ]
    }),
    typescript({
      declaration: true,
      outDir: './dist/src',
      declarationDir: './dist/src/types',
      exclude: ['next.config.ts', 'tailwind.config.ts']
    }),
    commonjs(),
    terser()
  ],
  external: ['next', 'next/server']
}

export default config
