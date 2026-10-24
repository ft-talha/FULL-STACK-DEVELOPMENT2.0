const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const file = path.join(__dirname, 'store.json');
const port = 3003;
const initial = { products: [], users: [], orders: [], cart: [] };
if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(initial, null, 2));

function readStore() { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function saveStore(store) { fs.writeFileSync(file, JSON.stringify(store, null, 2)); }
function reply(res, code, data) {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}
function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1000000) { reject(new Error('Request too large')); req.destroy(); }
        });
        req.on('end', () => {
            try { resolve(JSON.parse(body || '{}')); }
            catch { reject(new Error('Invalid JSON')); }
        });
        req.on('error', reject);
    });
}
function nextId(items) { return Math.max(0, ...items.map(x => Number(x.id) || 0)) + 1; }
function passwordHash(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString('hex');
}
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost:' + port);
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'api') {
        let name = url.pathname === '/' ? '/store.html' : url.pathname;
        let full = path.resolve(__dirname, '.' + name);
        if (!full.startsWith(__dirname + path.sep)) return reply(res, 403, { error: 'Forbidden' });
        const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg' };
        if (!fs.existsSync(full) || !fs.statSync(full).isFile() || !types[path.extname(full)]) return reply(res, 404, { error: 'Page not found' });
        res.writeHead(200, { 'Content-Type': types[path.extname(full)] + '; charset=utf-8' });
        return fs.createReadStream(full).pipe(res);
    }
    try {
        const store = readStore();
        const moduleName = parts[1];
        const id = parts[2];
        const method = req.method;
        if (parts.length > 3) return reply(res, 404, { error: 'Route not found' });
        if (moduleName === 'health' && method === 'GET') return reply(res, 200, { status: 'ok' });
        if (moduleName === 'register' && method === 'POST') {
            const body = await getBody(req);
            if (!body.name || !body.email || !body.password || String(body.password).length < 8) return reply(res, 400, { error: 'Name, email and password (8+ characters) required' });
            if (store.users.some(x => x.email === String(body.email).toLowerCase())) return reply(res, 409, { error: 'Email already registered' });
            const salt = crypto.randomBytes(16).toString('hex');
            const user = { id: nextId(store.users), name: body.name, email: String(body.email).toLowerCase(), salt, passwordHash: passwordHash(body.password, salt) };
            store.users.push(user); saveStore(store);
            return reply(res, 201, { message: 'Registered', user: { id: user.id, name: user.name, email: user.email } });
        }
        if (moduleName === 'login' && method === 'POST') {
            const body = await getBody(req);
            const user = store.users.find(x => x.email === String(body.email || '').toLowerCase());
            if (!user || passwordHash(String(body.password || ''), user.salt) !== user.passwordHash) return reply(res, 401, { error: 'Wrong email or password' });
            return reply(res, 200, { message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
        }
        if (moduleName === 'cart') {
            if (method === 'GET' && !id) return reply(res, 200, store.cart);
            if (method === 'POST' && !id) {
                const body = await getBody(req);
                const product = store.products.find(x => String(x.id) === String(body.productId));
                if (!product) return reply(res, 404, { error: 'Product not found' });
                const quantity = Number(body.quantity || 1);
                if (!Number.isInteger(quantity) || quantity < 1) return reply(res, 400, { error: 'Invalid quantity' });
                let item = store.cart.find(x => String(x.productId) === String(product.id));
                if (item) item.quantity += quantity;
                else store.cart.push({ productId: product.id, quantity });
                saveStore(store); return reply(res, 201, { message: 'Added to cart', cart: store.cart });
            }
            if (id && method === 'PUT') {
                const body = await getBody(req);
                const item = store.cart.find(x => String(x.productId) === id);
                if (!item) return reply(res, 404, { error: 'Cart item not found' });
                const quantity = Number(body.quantity);
                if (!Number.isInteger(quantity) || quantity < 1) return reply(res, 400, { error: 'Quantity must be at least 1' });
                item.quantity = quantity; saveStore(store); return reply(res, 200, item);
            }
            if (id && method === 'DELETE') {
                store.cart = store.cart.filter(x => String(x.productId) !== id);
                saveStore(store); return reply(res, 200, { message: 'Removed from cart' });
            }
            return reply(res, 404, { error: 'Route not found' });
        }
        if (!['products', 'orders'].includes(moduleName)) return reply(res, 404, { error: 'Route not found' });
        const items = store[moduleName];
        if (method === 'GET') {
            if (!id) return reply(res, 200, items);
            const found = items.find(x => String(x.id) === id);
            return found ? reply(res, 200, found) : reply(res, 404, { error: 'Record not found' });
        }
        if (method === 'POST' && !id) {
            const body = await getBody(req);
            if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(res, 400, { error: 'JSON object required' });
            if (moduleName === 'products' && (!body.title || !Number.isFinite(Number(body.price)) || Number(body.price) < 0)) return reply(res, 400, { error: 'Product title and valid price required' });
            if (moduleName === 'orders' && (!body.customer || !Array.isArray(body.items) || !body.items.length)) return reply(res, 400, { error: 'Customer and order items required' });
            const record = { ...body, id: nextId(items) };
            if (moduleName === 'orders') {
                const orderItems = [];
                for (const line of body.items) {
                    const product = store.products.find(x => String(x.id) === String(line.productId));
                    if (!product || !Number.isInteger(Number(line.quantity)) || Number(line.quantity) < 1) return reply(res, 400, { error: 'Invalid order items' });
                    orderItems.push({ productId: product.id, title: product.title, price: Number(product.price), quantity: Number(line.quantity) });
                }
                record.items = orderItems;
                record.total = orderItems.reduce((sum, x) => sum + x.price * x.quantity, 0);
                record.status = 'Placed'; record.date = new Date().toISOString();
                store.cart = [];
            }
            items.push(record); saveStore(store); return reply(res, 201, { message: 'Record added', data: record });
        }
        if (id && method === 'PUT') {
            const index = items.findIndex(x => String(x.id) === id);
            if (index < 0) return reply(res, 404, { error: 'Record not found' });
            const body = await getBody(req);
            if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(res, 400, { error: 'JSON object required' });
            if (moduleName === 'products' && body.price !== undefined && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) return reply(res, 400, { error: 'Invalid price' });
            if (moduleName === 'orders') return reply(res, 405, { error: 'Orders cannot be edited in this demo' });
            items[index] = { ...items[index], ...body, id: items[index].id };
            saveStore(store); return reply(res, 200, { message: 'Record updated', data: items[index] });
        }
        if (id && method === 'DELETE') {
            const index = items.findIndex(x => String(x.id) === id);
            if (index < 0) return reply(res, 404, { error: 'Record not found' });
            items.splice(index, 1);
            if (moduleName === 'products') store.cart = store.cart.filter(x => String(x.productId) !== id);
            saveStore(store); return reply(res, 200, { message: 'Record deleted' });
        }
        return reply(res, 404, { error: 'Route not found' });
    } catch (error) {
        return reply(res, error.message === 'Invalid JSON' ? 400 : 500, { error: error.message });
    }
});
server.listen(port, () => console.log('Open http://localhost:' + port));
