import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import localResolve from 'rollup-plugin-local-resolve'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import image from '@rollup/plugin-image'
import { string } from 'rollup-plugin-string'
import { rawGraphCss } from './bundler/rollupPluginRAWGraphCss'
import pkg from './package.json'

const vendors = []
  // Make all external dependencies to be exclude from rollup
  .concat(
    Object.keys(pkg.dependencies || {}), // TODO: keep or not?
    Object.keys(pkg.peerDependencies || {}),
    Object.keys(pkg.devDependencies || {})
  )
  .concat('./styles/base.css')

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

const chartEntries = {
  index: 'src/index.js',
    barchartparied: 'src/barchartpaired/index.js',
    bulletchart: 'src/bulletchart/index.js',
    connectedscatterplot: 'src/connectedscatterplot/index.js',
    paretochart: 'src/paretochart/index.js',
    similaritymap: 'src/similaritymap/index.js',
    polarareachart: 'src/polarareachart/index.js'
}

// UMD builds — single entry per chart, no code splitting
const umdBuilds = Object.entries(chartEntries).map(([name, inputFile]) => ({
  input: inputFile,
  output: {
    file: `lib/hcc-custom-charts-${name}.umd.js`,
    format: 'umd',
    name: `RawCharts_${name}`,
    exports: 'named',
  },
  external: [], // bundle dependencies inside UMD
  plugins: [
    localResolve(),
    commonjs(),
    image(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    rawGraphCss({
      include: '**/styles/*.raw.css',
    }),
    string({
      include: '**/styles/*.css',
      exclude: '**/styles/*.raw.css',
    }),
    resolve(),
    terser(),
  ],
}))

export default [...umdBuilds]