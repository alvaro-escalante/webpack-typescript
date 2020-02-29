// Module paths
const path = require('path')
// File System module
const fs = require('fs')
// Main webpack bundler
const webpack = require('webpack')
// Merger for webpack configurations
const merge = require('webpack-merge')
// Created html for bundle
const HtmlPlugin = require('html-webpack-plugin')
// CSS Linter
const StylelintPlugin = require('stylelint-webpack-plugin')
// On screen error console
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
// Tidy up plugings after ise
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// Copy folder
const CopyWebpackPlugin = require('copy-webpack-plugin')
// Module loaders
const load = require('./webpack.modules')

// Paths
const paths = {
  app: path.join(__dirname, '../app'),
  dist: path.join(__dirname, '../public')
}

// Main module
const commonConfig = merge([
  {
    context: paths.app,
    resolve: {
      unsafeCache: true,
      symlinks: false,
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
    },
    output: {
      path: paths.dist
    },
    plugins: [
      new HtmlPlugin({
        template: `${paths.app}/index.html`,
        inject: true
      }),
      // Style linter
      new StylelintPlugin({
        context: `${paths.app}/styles`,
        syntax: 'scss',
        emitErrors: false,
        configFile: path.resolve(__dirname, './stylelint.config.js')
      })
    ]
  },

  load.Scripts({
    include: `${paths.app}/scripts`,
    options: {
      transpileOnly: true,
      configFile: path.resolve(__dirname, './tsconfig.json'),
      compilerOptions: {
        sourceMap: true
      }
    }
  }),

  load.LintJS({
    include: `${paths.app}/scripts/*`,
    options: {
      emitWarning: true,
      failOnWarning: false,
      failOnError: true,
      fix: true,
      cache: true,
      formatter: require('eslint-friendly-formatter'),
      configFile: path.resolve(__dirname, './eslint.config.js')
    }
  })
])
// Production module
const productionConfig = merge([
  {
    mode: 'production',
    devtool: false,
    stats: {
      assets: true,
      modules: false,
      children: false
    },
    entry: {
      app: `${paths.app}/scripts/index.tsx`,
      styles: `${paths.app}/styles/index.scss`
    },
    output: {
      filename: 'static/scripts/[name].bundle.[contenthash:8].js'
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        maxAsyncRequests: 30,
        maxSize: 100000,
        minSize: 0,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },
    performance: {
      maxEntrypointSize: 400000, // in bytes
      maxAssetSize: 400000, // in bytes
      hints: 'warning' // 'error' or false are valid too
    },
    cache: true,
    plugins: [
      new CleanWebpackPlugin(),
      // new webpack.HashedModuleIdsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  },
  // HTML
  load.Html(true),
  // JS

  load.MinifyJS({
    extractComments: true,
    cache: true,
    parallel: true,
    sourceMap: false,
    terserOptions: {
      extractComments: 'all',
      parse: { ecma: 8 },
      compress: {
        ecma: 5,
        warnings: false,
        comparisons: false,
        drop_console: true
      },
      mangle: { safari10: true },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    }
  }),
  // CSS
  load.ExtractCSS({
    include: `${paths.app}/styles`,
    options: {
      filename: 'static/styles/[name].min.[contenthash:8].css'
    }
  }),
  load.MinifyCSS({
    options: {
      discardComments: { removeAll: true }
    }
  }),
  // Images
  load.Images({
    include: `${paths.app}/images`,
    options: {
      name: 'static/images/[name].[contenthash:8].[ext]',
      limit: 1000,
      esModule: false
    }
  }),
  load.Fonts({
    include: `${paths.app}/fonts`,
    options: {
      name: 'static/fonts/[name].[contenthash:8].[ext]',
      limit: 5000
    }
  }),
  load.OptimizeImages({
    options: {
      mozjpeg: { progressive: true },
      gifsicle: { interlaced: false },
      optipng: { optimizationLevel: 4 },
      pngquant: { quality: [0.75, 0.9], speed: 3 }
    }
  })
])

// Development module
const developmentConfig = merge([
  {
    mode: 'development',
    entry: [`${paths.app}/scripts/index.tsx`, `${paths.app}/styles/index.scss`],
    cache: true,
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new ErrorOverlayPlugin(),
      new CleanWebpackPlugin()
    ]
  },
  // Dev server main settings
  load.DevServer({
    host: process.env.HOST,
    port: 3000,
    contentBase: paths.dist
  }),
  // HTML
  load.Html(),

  // CSS
  load.Styles({
    include: `${paths.app}/styles`,
    options: {
      hmr: true,
      modules: true
    }
  }),
  // Images
  load.Images({
    include: `${paths.app}/images`,
    options: {
      esModule: false,
      limit: 0
    }
  }),
  // Fonts
  load.Fonts({
    include: `${paths.app}/fonts`,
    options: {
      name: `fonts/[name].[hash:8].[ext]`
    }
  })
])

// Merge modules
module.exports = env => merge(commonConfig, env === 'dev' ? developmentConfig : productionConfig)
