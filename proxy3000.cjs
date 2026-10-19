const http = require('http');

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: 4000,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: 'localhost:4000' }
  };

  const proxy = http.request(options, (targetRes) => {
    res.writeHead(targetRes.statusCode, targetRes.headers);
    targetRes.pipe(res, { end: true });
  });

  req.pipe(proxy, { end: true });

  proxy.on('error', (err) => {
    res.writeHead(502);
    res.end('Proxy Error: ' + err.message);
  });
});

server.listen(3000, () => {
  console.log('Port 3000 proxying to http://localhost:4000');
});
