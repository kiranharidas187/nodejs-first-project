const fs = require('fs');

const doRouting = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write(`<html><div><h1>Welcome to the app</h1>
        <form action="/create-user" method="POST"><input type="text" name="username" /> <button type="submit">Submit</button></form></div></html>`);
        return res.end();
    }
    if (url === '/create-user' && method === 'POST') {
        const data = [];
        req.on('data', (chunk) => {
            data.push(chunk);
        })
        return req.on('end', () => {
            const reqBody = Buffer.concat(data).toString();
            const formData = reqBody.split('=')[1] + ',';
            fs.appendFile('users.txt', formData, (error) => {
                if (!error) {
                    res.statusCode = 302;
                    res.setHeader('Location', '/users');
                    return res.end()
                }
            })
        })
    }

    if (url === '/users' && method === 'GET') {
        return fs.readFile('users.txt', (err, data) => {
            if (err) {
                return
            }
            const users = data.toString().split(',')
            res.write(`<html><div>Users List page</div><ul>`);
            users.forEach(user => {
                if (user && user.length) {
                    res.write(`<li>${user}</li>`)
                }
            });
            res.write('</ul></html>');
            res.end()
        })
    }
    res.write(`<html><div>First page</div></html>`);
    res.end();
}

module.exports = doRouting;