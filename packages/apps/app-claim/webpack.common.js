const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    sourceMap: true,
    importLoaders: 1,
    camelCase: true,
    localIdentName: '[local]__[hash:base64:5]',
    minimize: true
  }
}

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
    sourceMap: true,
    minimize: true
  }
}

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    plugins: () => [
      autoprefixer()
    ]
  }
}

module.exports = {
  entry: {
    vendor: ['webpack/hot/dev-server', '@babel/polyfill', 'react', 'react-dom', 'redux'],
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
    modules: [
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules'),
      path.resolve('../../../node_modules')
    ],
    alias: {
      wallets: path.resolve(__dirname, '../../../configs/wallets.config'),
      chains: path.resolve(__dirname, '../../../configs/chains.config'),
      dapps: path.resolve(__dirname, '../../../configs/dapps.config'),
      config: path.resolve(__dirname, '../../../configs/app.config'),
      'config-claim': path.resolve(__dirname, '../../../configs/claim.config'),
      variables: path.resolve(__dirname, '../linkdrop-commons/variables/index.module.scss')
    }
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.(scss|css)$/,
      exclude: /\.module\.scss$/,
      use: [
        process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        CSSLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.module\.scss$/,
      use: [
        process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        CSSModuleLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg|otf|gif|jpg|jpeg)$/,
      use: {
        loader: 'file-loader?limit=100000',
        options: {
          esModule: false,
        },
      }
    }]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[hash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      MASTER_COPY: JSON.stringify(process.env.MASTER_COPY),
      FACTORY: JSON.stringify(process.env.FACTORY),
      INFURA_PK: JSON.stringify(process.env.INFURA_PK),
      INITIAL_BLOCK_RINKEBY: JSON.stringify(process.env.INITIAL_BLOCK_RINKEBY),
      INITIAL_BLOCK_MAINNET: JSON.stringify(process.env.INITIAL_BLOCK_MAINNET),
      INITIAL_BLOCK_GOERLI: JSON.stringify(process.env.INITIAL_BLOCK_GOERLI),
      INITIAL_BLOCK_ROPSTEN: JSON.stringify(process.env.INITIAL_BLOCK_ROPSTEN),
      INITIAL_BLOCK_KOVAN: JSON.stringify(process.env.INITIAL_BLOCK_KOVAN),
      CONTRACT_ADDRESS: JSON.stringify(process.env.CONTRACT_ADDRESS),
      MAIN_TOKEN_TITLE: JSON.stringify(process.env.MAIN_TOKEN_TITLE),
      DEFAULT_CHAIN_ID:JSON.stringify(process.env.DEFAULT_CHAIN_ID),
      API_URL: JSON.stringify(process.env.API_URL),
      IPFS_GATEWAY_URL: JSON.stringify(process.env.IPFS_GATEWAY_URL),
      TWEET_ADDRESS_SALT: JSON.stringify(process.env.TWEET_ADDRESS_SALT),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ]
}
