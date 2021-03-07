const net = require('net');
const ResponseParser = require('./ResponseParser')
const BodyParser = require('./BodyParser')

class Request {
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};

        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = "application/x-www-form-urlencoded"
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(options.body);
        }
        else if (this.headers['Content-Type'] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join("\r\n")}\r
\r
${this.bodyText}
`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {

            const parser = new ResponseParser;
            if (!connection) {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    console.log('create connection success...')
                    connection.write(this.toString());
                });
            }
            else {
                connection.write(this.toString());
            }

            connection.on('data', (data) => {
                console.log('connected...')
                parser.receive(data.toString())
                if (parser.isFinished) {
                    resolve(parser.response);
                    connection.end();
                }
            });
            connection.on('error', err => {
                reject(err)
                connection.end();
            });

        });
    }


}


void async function () {
    let request = new Request({
        method: 'POST',
        host: 'localhost',
        port: '8080',
        path: '/',
        headers: {
            ['X-Foo2']: 'customed'
        },
        body: {
            name: 'xiaolin'
        }
    });

    let response = await request.send();
    BodyParser.parse(response.body);
}()
