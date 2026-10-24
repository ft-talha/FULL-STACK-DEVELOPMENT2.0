async function api(path, method = 'GET', body) {
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) options.body = JSON.stringify(body);
    const response = await fetch('/api' + path, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
}
function safe(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function money(value) { return '$' + Number(value || 0).toFixed(2); }
function notice(message) { alert(message); }
async function addToCart(id) {
    try { await api('/cart', 'POST', { productId: id, quantity: 1 }); notice('Product added to cart'); }
    catch (e) { notice(e.message); }
}
async function loadProducts() {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    const products = await api('/products');
    grid.innerHTML = products.map(p => `
        <div class="col-6 col-md-4 col-lg-3 p-card" data-cat="${safe(p.category)}">
            <article class="product-card h-100">
                <div class="product-img-box"><img src="${safe(p.image_url || 'https://placehold.co/600x400?text=Product')}" alt="${safe(p.title)}"></div>
                <div class="p-3 d-flex flex-column flex-grow-1">
                    <div class="text-muted small mb-1">${safe(p.category)}</div>
                    <h6 class="fw-bold mb-1" style="color:var(--emerald-dark)">${safe(p.title)}</h6>
                    <div class="mt-auto d-flex align-items-center justify-content-between pt-2 border-top">
                        <span class="fw-bold fs-6" style="color:var(--sage-war)">${money(p.price)}</span>
                        <button class="btn btn-sm btn-success" data-add="${p.id}" type="button">Add</button>
                    </div>
                </div>
            </article>
        </div>`).join('');
    grid.addEventListener('click', e => {
        const button = e.target.closest('[data-add]');
        if (button) addToCart(Number(button.dataset.add));
    });
}
async function setupAddProduct() {
    const form = document.querySelector('form:has(#newTitle)');
    if (!form) return;
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const image = document.getElementById('newImgUrl').value.trim();
        const product = {
            title: document.getElementById('newTitle').value.trim(),
            category: document.getElementById('newCategory').value,
            price: Number(document.getElementById('newPrice').value),
            original_price: Number(document.getElementById('newOriginalPrice').value || 0),
            stock: Number(document.getElementById('newStock').value || 0),
            image_url: image || 'https://placehold.co/600x400?text=Product',
            description: document.getElementById('newDesc').value.trim()
        };
        try { await api('/products', 'POST', product); notice('Product saved permanently'); location.href = 'store.html'; }
        catch (err) { notice(err.message); }
    });
}
async function loadCart() {
    const container = document.querySelector('.cart-item-card')?.parentElement;
    if (!container) return;
    const [cart, products] = await Promise.all([api('/cart'), api('/products')]);
    const rows = cart.map(item => ({ ...item, product: products.find(p => String(p.id) === String(item.productId)) })).filter(x => x.product);
    container.querySelectorAll('.cart-item-card').forEach(x => x.remove());
    const html = rows.map(x => `
        <div class="cart-item-card" data-product="${x.productId}">
            <div class="d-flex align-items-center gap-3 flex-wrap">
                <img class="cart-thumb" src="${safe(x.product.image_url)}" alt="${safe(x.product.title)}">
                <div class="flex-grow-1"><h6 class="cart-item-title">${safe(x.product.title)}</h6>
                    <div class="cart-item-cat">${safe(x.product.category)}</div><div>${money(x.product.price)} each</div>
                </div>
                <button class="btn btn-outline-secondary btn-sm" data-change="-1">−</button>
                <strong>${x.quantity}</strong>
                <button class="btn btn-outline-secondary btn-sm" data-change="1">+</button>
                <strong>${money(x.product.price * x.quantity)}</strong>
                <button class="btn btn-outline-danger btn-sm" data-remove="1">Remove</button>
            </div>
        </div>`).join('');
    container.insertAdjacentHTML('afterbegin', html || '<p>Your cart is empty. Add products from the store.</p>');
    const total = rows.reduce((sum, x) => sum + x.product.price * x.quantity, 0);
    let summary = document.getElementById('live-cart-total');
    if (!summary) {
        summary = document.createElement('div'); summary.id = 'live-cart-total';
        summary.style.cssText = 'padding:16px;font-size:20px;font-weight:bold;color:#285e46';
        const checkout = document.querySelector('a[href="checkout.html"]');
        (checkout?.parentElement || container).prepend(summary);
    }
    summary.textContent = 'Current cart total: ' + money(total);
    container.onclick = async e => {
        const card = e.target.closest('[data-product]');
        if (!card) return;
        const id = card.dataset.product;
        try {
            if (e.target.closest('[data-remove]')) await api('/cart/' + id, 'DELETE');
            else if (e.target.closest('[data-change]')) {
                const row = rows.find(x => String(x.productId) === id);
                const quantity = row.quantity + Number(e.target.dataset.change);
                if (quantity < 1) await api('/cart/' + id, 'DELETE');
                else await api('/cart/' + id, 'PUT', { quantity });
            } else return;
            await loadCart();
        } catch (err) { notice(err.message); }
    };
}
async function setupCheckout() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;
    const cart = await api('/cart');
    const products = await api('/products');
    const total = cart.reduce((sum, x) => sum + Number(products.find(p => String(p.id) === String(x.productId))?.price || 0) * x.quantity, 0);
    const box = document.createElement('div');
    box.style.cssText = 'padding:12px;margin:12px 0;background:#eef5ed;border-radius:8px';
    box.textContent = `Items: ${cart.reduce((sum, x) => sum + x.quantity, 0)} | Order total: ${money(total)}`;
    form.prepend(box);
    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        if (!cart.length) return notice('Your cart is empty');
        const customer = Object.fromEntries(new FormData(form).entries());
        try {
            const result = await api('/orders', 'POST', { customer, items: cart });
            notice('Order placed successfully. Order ID: ' + result.data.id);
            location.href = 'store.html';
        } catch (err) { notice(err.message); }
    });
}
function setupAuth() {
    const login = document.querySelector('form:has(#loginEmail)');
    const register = document.querySelector('form:has(#regEmail)');
    if (register) register.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            await api('/register', 'POST', {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value
            });
            notice('Registration successful. Now sign in.');
        } catch (err) { notice(err.message); }
    });
    if (login) login.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const result = await api('/login', 'POST', {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            });
            sessionStorage.setItem('store_user', JSON.stringify(result.user));
            location.href = 'store.html';
        } catch (err) { notice(err.message); }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    setupAuth();
    Promise.all([loadProducts(), setupAddProduct(), loadCart(), setupCheckout()]).catch(err => console.error('API error:', err.message));
});
