const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

class Server {
  constructor(costChecker, port =80, uiPage = 'index.html', ) {
    this.port = port;
    this.uiPage = uiPage;
    this.costChecker = costChecker;
  }

  start() {
    const server = http.createServer((req, res) => {
      const pathName = url.parse(req.url).pathname;
      let chunks = [];

      req.on('error', (err) => {
        console.error(err);
        res.end("Oh snap!");
      }).on('data', (chunk) => {
        chunks.push(chunk);
      }).on('end', () => {
        const body = Buffer.concat(chunks).toString();
        if (pathName === '/' || pathName === "/index") {
          this.serveUiPage(res, this.uiPage);
        }
        else if (pathName === '/api/cost') {
          const {collectionName, commandName, expression} = JSON.parse(body);
          this.costChecker
            .check(collectionName, expression, commandName)
            .then(r => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(r))
            }).catch(e => {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify(e))

            });
        }
        else {
          res.end("Nothing");
        }
      })
    });

    server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    return server.listen(this.port);
  }

  serveUiPage(response, uiPage) {
    const fileName = path.join(__dirname, uiPage);

    return fs.readFile(fileName, { encoding: 'utf8' }, (err, data) => {
      if (err) { throw err; }

      response.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': data.length
      });

      response.end(data);
    });
  }
}

module.exports = Server;