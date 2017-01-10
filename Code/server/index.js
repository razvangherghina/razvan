import express from 'express';
import socket from './socket';
import http from 'http';
import socketIO from 'socket.io';

import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../config/webpack.config';
import project from '../config/project.config';
import compression from 'compression';
const debug = require('debug')('app:server');

const app = express();
const server = http.Server(app);
const io = socketIO(server);



// Apply gzip compression
app.use(compression());

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: project.paths.client(),
    hot: true,
    quiet: project.compiler_quiet,
    noInfo: project.compiler_quiet,
    lazy: false,
    stats: project.compiler_stats
  }));
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }));

    // Serve static assets from ~/public since Webpack is unaware of
    // these files. This middleware doesn't need to be enabled outside
    // of development since this directory will be copied into ~/dist
    // when the application is compiled.
  app.use(express.static(project.paths.public()));

    // This rewrites all routes requests to the root /index.html file
    // (ignoring file requests). If you want to implement universal
    // rendering, you'll want to remove this middleware.
  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });
} else {
  debug('Server is being run in production enivironment!');

    // Serving ~/dist by default. Ideally these files should be served by
    // the web server and not the app server, but this helps to demo the
    // server in production.
  app.use(express.static(project.paths.dist()));
}

server.listen(project.server_port);

// Socket data
io.on('connection', socket);
debug(`Server is now running at http://localhost:${project.server_port}.`);

