// Optimise CSS
const PurgecssPlugin = require('purgecss-webpack-plugin')
// Optimise Assests
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// Extract CSS to avoud FOUC
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Optimise JS
const TerserPlugin = require('terser-webpack-plugin')

exports.DevServer = ({ host, port, contentBase, proxy, https } = {}) => ({
  devServer: {
    host,
    port,
    contentBase,
    proxy,
    https,
    hot: true,
    compress: true,
    watchOptions: { ignored: /node_modules/ },
    watchContentBase: true,
    disableHostCheck: true,
    liveReload: true,
    clientLogLevel: 'info',
    historyApiFallback: true,
    stats: {
      colors: true,
      children: false,
      maxModules: 0,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      errors: false
    },
    overlay: {
      errors: false,
      warnings: false
    },
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
})

// HTML
exports.Html = () => ({
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: false } }]
      }
    ]
  }
})

// JS Scripts
exports.Scripts = ({ include, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include,
        use: [{ loader: 'ts-loader', options }]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  }
})

// JS Minification
exports.MinifyJS = options => ({
  optimization: {
    minimizer: [new TerserPlugin(options)]
  }
})

// JS Linter
exports.LintJS = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        enforce: 'pre',
        include,
        exclude,
        use: {
          options,
          loader: 'eslint-loader'
        }
      }
    ]
  }
})

// Development extraction of CSS
exports.Styles = ({ include, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options
          },
          'css-loader?sourceMap',
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
})

// On Firefox style loader does not produce source maps with React Developer tools addon enabled
// exports.Styles = ({ include } = {}) => ({
//   module: {
//     rules: [
//       {
//         test: /\.scss$/,
//         include,
//         use: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
//       }
//     ]
//   }
// })

// Production extraction of CSS
exports.ExtractCSS = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.scss$/,
        include,
        exclude,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../' // Account for the static extra folder on prod
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { plugins: () => [require('autoprefixer')] }
          },
          { loader: 'resolve-url-loader' },
          'sass-loader'
        ],
        sideEffects: true
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin(options)]
})

// Remove unused CSS
exports.PurifyCSS = options => ({
  plugins: [new PurgecssPlugin(options)]
})

// CSS Minification
exports.MinifyCSS = ({ options }) => ({
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: options,
        canPrint: true // false for analyzer
      })
    ]
  }
})

// Images
exports.Images = ({ include, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        include,
        use: [{ loader: 'url-loader', options }]
      }
    ]
  }
})

// Images optimisation
exports.OptimizeImages = ({ include, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        include,
        use: [{ loader: 'image-webpack-loader', options }],
        enforce: 'pre'
      }
    ]
  }
})

// Fonts
exports.Fonts = ({ include, options } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        include,
        use: [{ loader: 'url-loader', options }]
      }
    ]
  }
})
