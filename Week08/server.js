const http = require('http');

http.createServer( (request, response) => {
    let body = [];
    request.on('error', error => {
        console.log(error);
    }).on('data', chunk => {
        body.push(chunk)
    }).on('end', () =>{
        body = Buffer.concat(body).toString();
        console.log('body', body);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello World!');
    })
}).listen(8080);

console.log('server start');
