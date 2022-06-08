const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', { 
      target: `http://172.30.1.80:6000`,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware('/statics', {
      target: `http://172.30.1.80:6000`,
      changeOrigin: true
    })
  );
};
