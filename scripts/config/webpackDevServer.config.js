// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
"use strict";

const fs = require("fs");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const paths = require("./paths");
const getHttpsConfig = require("./getHttpsConfig");

const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

const webpackDevClientEntry = require.resolve(
  "react-dev-utils/webpackHotDevClient"
);

module.exports = function (proxy, allowedHost) {
  return {
    client: {
      logging: "none",
      overlay: false,
      webSocketTransport: "ws",
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
    },
    webSocketServer: "ws",
    compress: true,
    static: {
      directory: paths.appPublic,
      publicPath: paths.publicUrlOrPath,
      watch: true,
    },
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. Note that only changes to CSS are currently hot reloaded.
    // JS changes will refresh the browser.
    hot: true,
    watchFiles: {
      paths: [paths.appSrc],
    },
    allowedHosts: [allowedHost],
    https: getHttpsConfig(),
    host,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
    proxy,
    onBeforeSetupMiddleware: (devServer) => {
      const app = devServer.app;
      // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(devServer));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      if (fs.existsSync(paths.proxySetup)) {
        // This registers user provided middleware for proxy reasons
        require(paths.proxySetup)(app);
      }
    },
    onAfterSetupMiddleware: (devServer) => {
      const app = devServer.app;
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
