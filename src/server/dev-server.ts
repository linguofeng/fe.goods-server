const WebpackDevServer = require('webpack-dev-server');
import * as webpack from 'webpack';
import * as config from 'config';
import * as path from 'path';
import * as http from 'http';

const root = config.get('root') as string;
const webpackConfig = require(path.resolve(root, './config/webpack.dev.js'));
const compiler = webpack(webpackConfig);

// @thx shiyun 4 hot load
const server = new WebpackDevServer(compiler, {
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  progress: true,
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
});

server.listen(config.get('webpack.port') as number, '0.0.0.0');

// hot load for node.js
http
  .createServer(function(req, res) {
    Object.keys(require.cache).forEach(module => {
      if (!module.match(/node_modules/)) {
        delete require.cache[module];
      }
    });
    require('./app').default.callback()(req, res);
  })
  .listen(config.get('port'), () => {
    console.log('dev server is listen on port:', config.get('port'));
  });
