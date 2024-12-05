// server.js

const http = require('http');
const fs = require('fs');

const port = 3005;
const rootDir = './';

http.createServer((req, res) => {
    let filePath;

    switch (req.url) {
        case '/':
            filePath = `${rootDir}/index.html`;
            break;
        case '/manifest.json':
            filePath = `${rootDir}/manifest.json`;
            break;
        case '/style.css':
            filePath = `${rootDir}/style.css`;
            break;
        case '/script.js':
            filePath = `${rootDir}/script.js`;
            break;
        case '/service-worker.js':
            filePath = `${rootDir}/service-worker.js`;
            break;
        case '/bot.js':
            filePath = `${rootDir}/bot.js`;
            break;
        case '/favicon.ico':
            filePath = `${rootDir}/favicon.ico`;
            break;
        case '/icon.png':
            filePath = `${rootDir}/icon.png`;
            break;
        default:
            filePath = null;
            break;
    }

    if(filePath == null) {
        res.writeHead(404);
        res.end('');
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error 500');
        } else {
            const mimeType = getMimeType(filePath);

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Cache-Control': 'max-age=86400', // cache for 1 day
                'Connection': 'keep-alive',
            });
            res.write(data);
            res.end();
        }
    });
}).listen(port, () => {
    console.log(`Server started on port ${port}`);
});

function getMimeType(filePath) {
    const extension = filePath.split('.').pop();

    switch (extension) {
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        case 'png':
            return 'image/png';
        case 'jpg':
            return 'image/jpeg';
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'svg':
            return 'image/svg+xml';
        case 'json':
            return 'application/json';
        default:
            return 'application/octet-stream';
    }
}