'use strict';

import cp from 'child_process';
import path from 'path';
import debug from 'debug';
import browserSync from 'browser-sync';
import watch from 'node-watch';

import assign from 'react/lib/Object.assign';

let server;
let started;
let serverReload;
const KOA_PATH = path.join(__dirname, '../../server/index');

const restartServer = () => {
  debug('dev')('restarting koa application');
  serverReload = true;
  server.kill('SIGTERM');
  return startServer();
};

const startServer = () => {
  // merge env for the new process
  const env = assign({NODE_ENV: 'development'}, process.env);
  // start the server procress
  server = cp.fork(KOA_PATH, {env});
  // when server is `online`
  server.once('message', (message) => {
    if (message.match(/^online$/)) {
      if (serverReload) {
        serverReload = false;
        browserSync.reload();
      }
      if (!started) {
        started = true;

        // Start browserSync
        browserSync({
          port: parseInt(process.env.PORT) + 2 || 3002,
          proxy: `0.0.0.0:${parseInt(process.env.PORT) || 3000}`
        });

        // Listen for `rs` in stdin to restart server
        debug('dev')('type `rs` in console for restarting koa application');
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (data) {
          data = (data + '').trim().toLowerCase();
          if (data === 'rs') return restartServer();
        });

        // Start watcher on server files
        // and reload browser on change
        watch(
          path.join(__dirname, '../../server'),
          (file) => {
            if (!file.match('webpack-stats.json')) {
              debug('dev')('restarting koa application');
              serverReload = true;
              server.kill('SIGTERM');
              return startServer();
            }
          }
        );

      }
    }
  });
};

// kill server on exit
process.on('exit', () => server.kill('SIGTERM'));

export default function () {
  if (!server) {
    return startServer();
  }
}
