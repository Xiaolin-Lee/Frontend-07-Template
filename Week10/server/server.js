const http = require('http');

const RESPONSE_BODY = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <style>
    #container {
      width: 500px;
      height: 300px;
      display: flex;
      background-color: rgb(255, 255, 255);
    }
    #container #myid {
      width: 200px;
      height:100px;
      background-color: rgb(255, 0, 0);
    }
    #container .c1 {
      flex: 1;
      background-color: rgb(0, 255, 0);
    }
    
  </style>
</head>
<body>
  <div id="container" class="my">
    <div id="myid"></div>
    <div class="c1"></div>
  </div>
</body>
</html>
`;

http.createServer( (request, response) => {
    let body = [];
    request.on('error', error => {
        console.log(error);
    }).on('data', chunk => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(RESPONSE_BODY);
    })
}).listen(8080);

console.log('server started...');