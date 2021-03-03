const http = require("http"),
    fs = require("fs");

http.createServer((request, response) => {
    let addr = request.url;
    let q = new URL(addr, "http://localhost:8080");
    let filePath = "";
    console.log(q);

    fs.appendFile("log.txt", `URL: ${addr} ${new Date()}\n\n`, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Log updted.")
        }
    });

    if (q.pathname.includes("documentation")) {
        filePath = __dirname + "/documentation.html"
    } else {
        filePath = "./index.html";
    };

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err
        }
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.end(data);
    })
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');