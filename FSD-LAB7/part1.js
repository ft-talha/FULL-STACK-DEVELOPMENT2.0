const http = require('node:http');

let students = [];
let teachers = [];
let attendance = [];
let marks = [];

let nextStudentId = 1;
let nextTeacherId = 1;
let nextAttendanceId = 1;
let nextMarksId = 1;

const server = http.createServer(async(req, res) => {

    const send = (status, body) => {
        res.writeHead(status, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(body));
    };

    const url = new URL(req.url, 'http://localhost:3004');

    if (req.method === 'GET' && url.pathname === '/') {
        return send(200, {
            message: 'Welcome to Student Management System',
            modules: ['students', 'teachers', 'attendance', 'marks']
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
        return send(404, { error: 'Not found' });
    }

    if (parts.length > 2) {
        return send(404, { error: 'Not found' });
    }


    if (req.method === 'GET') {

        if (id) {

            let item = data.find(x => x.id == id);

            if (!item) {
                return send(404, { error: 'Record not found' });
            }

            return send(200, item);
        }

        return send(200, data);
    }


    if (req.method === 'POST' && !id) {

        try {

            let raw = '';

            for await (const chunk of req) {

                raw += chunk;

                if (Buffer.byteLength(raw) > 65536) {
                    return send(413, { error: 'Too large' });
                }
            }

            let item = JSON.parse(raw);

            if (!item || typeof item !== 'object' || Array.isArray(item)) {
                return send(400, { error: 'Invalid data' });
            }

            let newItem;

            if (moduleName === 'students') {

                if (typeof item.name !== 'string' || !item.name.trim()) {
                    return send(400, { error: 'Student name required' });
                }

                newItem = {
                    id: nextStudentId++,
                    name: item.name.trim(),
                    age: item.age,
                    semester: item.semester
                };
            } else if (moduleName === 'teachers') {

                if (typeof item.name !== 'string' || !item.name.trim()) {
                    return send(400, { error: 'Teacher name required' });
                }

                newItem = {
                    id: nextTeacherId++,
                    name: item.name.trim(),
                    subject: item.subject
                };
            } else if (moduleName === 'attendance') {

                if (item.studentId == null || !item.date || !item.status) {
                    return send(400, { error: 'Attendance details required' });
                }

                newItem = {
                    id: nextAttendanceId++,
                    studentId: item.studentId,
                    date: item.date,
                    status: item.status
                };
            } else if (moduleName === 'marks') {

                if (item.studentId == null || !item.subject || item.marks == null) {
                    return send(400, { error: 'Marks details required' });
                }

                newItem = {
                    id: nextMarksId++,
                    studentId: item.studentId,
                    subject: item.subject,
                    marks: item.marks
                };
            }

            data.push(newItem);

            return send(201, {
                message: 'Record added successfully',
                data: newItem
            });

        } catch (error) {

            if (error instanceof SyntaxError) {
                return send(400, { error: 'Invalid JSON' });
            }

            console.error(error);

            return send(500, { error: 'Server error' });
        }
    }


    if (req.method === 'PUT' && id) {

        try {

            let raw = '';

            for await (const chunk of req) {

                raw += chunk;

                if (Buffer.byteLength(raw) > 65536) {
                    return send(413, { error: 'Too large' });
                }
            }

            let updatedData = JSON.parse(raw);

            if (!updatedData || typeof updatedData !== 'object' || Array.isArray(updatedData)) {
                return send(400, { error: 'Invalid data' });
            }

            let index = data.findIndex(x => x.id == id);

            if (index === -1) {
                return send(404, { error: 'Record not found' });
            }

            if (updatedData.name !== undefined) {
                if (typeof updatedData.name !== 'string' || !updatedData.name.trim()) {
                    return send(400, { error: 'Valid name required' });
                }

                updatedData.name = updatedData.name.trim();
            }

            data[index] = {
                ...data[index],
                ...updatedData,
                id: data[index].id
            };

            return send(200, {
                message: 'Record updated successfully',
                data: data[index]
            });

        } catch (error) {

            if (error instanceof SyntaxError) {
                return send(400, { error: 'Invalid JSON' });
            }

            console.error(error);

            return send(500, { error: 'Server error' });
        }
    }


    if (req.method === 'DELETE' && id) {

        let index = data.findIndex(x => x.id == id);

        if (index === -1) {
            return send(404, { error: 'Record not found' });
        }

        data.splice(index, 1);

        return send(200, {
            message: 'Record deleted successfully'
        });
    }


    send(404, { error: 'Not found' });

});

server.listen(3004, () => {
    console.log('Memory API: http://localhost:3004');
});