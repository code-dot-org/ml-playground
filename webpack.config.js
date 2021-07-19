const path = require("path");

const commonConfig = {
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    // Note: Separate aliases are required for aliases to work in unit tests. These should
    // be added in package.json in the jest configuration.
    alias: {
      '@ml': path.resolve(__dirname, 'src'),
      '@public': path.resolve(__dirname, 'public')
    }
  },
  output: {
    filename: "[name].js",
    libraryTarget: 'umd',
    clean: true,
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.jsx$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'env'],
              plugins: ['transform-class-properties']
            }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          outputPath: 'assets/images',
          publicPath: 'images',
          postTransformPublicPath: p =>
            `__ml_playground_asset_public_path__ + ${p}`,
          name: '[name].[ext]?[contenthash]'
        }
      },
    ]
  },
  performance: {
    assetFilter: function(assetFilename) {
      return /^assets\//.test(assetFilename);
    },
    maxAssetSize: 300000,
    maxEntrypointSize: 10500000
  }
};

const externalConfig = {
  externals: {
    lodash: 'lodash',
    radium: 'radium',
    react: 'react',
    'react-dom': 'react-dom'
  }
};

const defaultConfig = [
  {
    entry: {
      assetPath: './src/assetPath.js'
    },
    ...commonConfig,
    ...externalConfig
  },
  {
    entry: {
      mainDev: './src/indexDev.js'
    },
    ...commonConfig
  }
];

const productionConfig = [
  {
    entry: {
      main: './src/indexProd.js'
    },
    ...commonConfig,
    ...externalConfig
  }
];

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return [...defaultConfig, ...productionConfig];
  }

  return defaultConfig;
};
