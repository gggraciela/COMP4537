const http = require('http');
const url = require('url');
const fs = require('fs');
const utils = require('./modules/utils');
const messages = require('./lang/en/en');

const PORT = 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Part B: Handle GET request to return a greeting with server date and time
    if (parsedUrl.pathname === '/COMP4537/labs/3/getDate/') {
        const name = parsedUrl.query.name || "Guest";
        const serverTime = utils.getDate();
        const message = messages.greeting.replace("%1", name).replace("%2", serverTime);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color:blue">${message}</p>`);
    } 

    // Part C.1: Writing to a file (Appending text)
    else if (parsedUrl.pathname === '/COMP4537/labs/3/writeFile/') {
        const text = parsedUrl.query.text;
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end("400 Bad Request: Missing 'text' query parameter");
        }

        fs.appendFile('file.txt', text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end("500 Internal Server Error: Unable to write to file");
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Text appended successfully: ${text}`);
        });
    } 

    // Part C.2: Reading from a file
    else if (parsedUrl.pathname === '/COMP4537/labs/3/readFile/file.txt') {
        fs.readFile('file.txt', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end("404 Not Found: file.txt does not exist");
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    } 

    // Handle invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end("404 Not Found");
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
});
