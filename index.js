const http = require('http');
const url = require('url');
const net = require('net');

const server = http.createServer((request, response) => {
    const req = http.request(request.url,{method: 'GET'},(res)=>{
        response.writeHead(200,res.headers);
        response.pipe(res);
    }).on('error', err=>{
        console.log("Error:"+err.message);
    });
    req.end();
});

server.on('connect', (req, socket) => {
    const srvUrl = url.parse(`http://${req.url}`);
    const srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
        socket.write(
            `HTTP/${req.httpVersion} 200 OK\r\nConnection: close\r\n\r\n`,
            'UTF-8',
            () => {
                srvSocket.pipe(socket);
                socket.pipe(srvSocket);
            }
        )
    })
});