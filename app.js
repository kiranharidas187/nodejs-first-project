const http = require('http');
const routes = require('./routing');

const server = http.createServer(routes);

server.listen(3000)