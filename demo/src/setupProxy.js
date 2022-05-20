const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', { target: `http://172.30.12.18:3000` })
  );
  app.use(
    createProxyMiddleware('/statics', {
      target: `http://172.30.12.18:3000`,
    })
  );
};
