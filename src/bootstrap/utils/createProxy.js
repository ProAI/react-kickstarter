import httpProxy from 'http-proxy';

function proxyError(error, req, res) {
  // add the error handling
  // https://github.com/nodejitsu/node-http-proxy/issues/527
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = { error: 'proxy_error', reason: error.message };
  res.end(JSON.stringify(json));
};

export default function createProxy(options, server) {
  const proxy = httpProxy.createProxyServer(options);

  if (options.ws && server) {
    server.on('upgrade', (req, socket, head) => {
      proxy.ws(req, socket, head);
    });
  }

  return (req, res) => {
    proxy.web(req, res, {}, proxyError);
  };
};
