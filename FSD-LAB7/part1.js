const http = require('node:http');

let students = [];
let teachers = [];
let attendance = [];
let marks = [];

const server = http.createServer((req, res) => {

    const url = new URL(req.url, 'http://localhost:3002');

    const reply = (code, body) => {
        res.writeHead(code, {
            'Content-Type': 'application/json; charset=utf-8'
        });

        res.end(JSON.stringify(body));
    };


    if (req.method === 'GET' && url.pathname === '/') {
        return reply(200, {
            message: 'Welcome to Student Management System',
            modules: ['students', 'teachers', 'attendance', 'marks']
        });
    }


    if (req.method === 'GET' && url.pathname === '/health') {
        return reply(200, {
            status: 'ok'
        });
    }


    if (req.method === 'GET' && url.pathname === '/hello') {
        return reply(200, {
            message: `Hello ${url.searchParams.get('name') ?? 'Guest'}`
        });
    }


    let parts = url.pathname.split('/').filter(Boolean);

    let moduleName = parts[0];
    let id = parts[1];

    let data;


    if (moduleName === 'students') {
        data = students;
    } else if (moduleName === 'teachers') {
        data = teachers;
    } else if (moduleName === 'attendance') {
        data = attendance;
    } else if (moduleName === 'marks') {
        data = marks;
    } else {
        return reply(404, {
            error: 'Route not found'
        });
    }


    if (parts.length > 2) {
        return reply(404, {
            error: 'Route not found'
        });
    }


    if (req.method === 'GET') {

        if (id) {

            let item = data.find(x => String(x.id) === id);

            if (!item) {
                return reply(404, {
                    error: 'Record not found'
                });
            }

            return reply(200, item);
        }

        return reply(200, data);
    }


    if (req.method === 'POST' || req.method === 'PUT') {

        if (req.method === 'POST' && id) {
            return reply(404, {
                error: 'Route not found'
            });
        }

        if (req.method === 'PUT' && !id) {
            return reply(404, {
                error: 'Route not found'
            });
        }

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            let item;

            try {
                item = JSON.parse(body);
            } catch {
                return reply(400, {
                    error: 'Invalid JSON'
                });
            }

            if (!item || typeof item !== 'object' || Array.isArray(item)) {
                return reply(400, {
                    error: 'JSON object required'
                });
            }


            if (req.method === 'POST') {

                if (item.id == null) {
                    return reply(400, {
                        error: 'ID is required'
                    });
                }

                let found = data.find(x => String(x.id) === String(item.id));

                if (found) {
                    return reply(400, {
                        error: 'ID already exists'
                    });
                }

                data.push(item);

                return reply(201, {
                    message: 'Record added successfully',
                    data: item
                });
            }


            if (req.method === 'PUT') {

                let index = data.findIndex(x => String(x.id) === id);

                if (index === -1) {
                    return reply(404, {
                        error: 'Record not found'
                    });
                }

                data[index] = {
                    ...data[index],
                    ...item,
                    id: data[index].id
                };

                return reply(200, {
                    message: 'Record updated successfully',
                    data: data[index]
                });
            }

        });

        return;
    }


    if (req.method === 'DELETE' && id) {

        let index = data.findIndex(x => String(x.id) === id);

        if (index === -1) {
            return reply(404, {
                error: 'Record not found'
            });
        }

        data.splice(index, 1);

        return reply(200, {
            message: 'Record deleted successfully'
        });
    }


    return reply(404, {
        error: 'Route not found'
    });

});


server.listen(3002, () => {
    console.log('Server running on http://localhost:3002');
});