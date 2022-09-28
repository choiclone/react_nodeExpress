const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // 도커 서버 api docker 빌드 시 사용하면 될듯 ex) http://내_PC_IP:6000 으로 알아서 바꿔라
  /*
  app.use(
    createProxyMiddleware('/api', { 
      target: `http://172.30.1.80:6000`,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware('/staticFolder', {
      target: `http://172.30.1.80:6000/`
    })
  );*/

  /* 로컬 서버 api*/
  app.use(
    createProxyMiddleware('/api', { 
      target: `http://localhost:3000`,
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware('/staticFolder', {
      target: `http://localhost:3000/`
    })
  );
};
