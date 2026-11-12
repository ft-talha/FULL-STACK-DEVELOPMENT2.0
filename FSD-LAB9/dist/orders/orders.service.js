"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("../cart/cart.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(cartService, productsService) {
        this.cartService = cartService;
        this.productsService = productsService;
        this.orders = [];
        this.orderCounter = 9912;
    }
    createOrder(payload) {
        const firstName = String(payload.first_name || payload.firstName || '').trim();
        const lastName = String(payload.last_name || payload.lastName || '').trim();
        const email = String(payload.email || '').trim();
        const phone = String(payload.phone || '').trim();
        const address = String(payload.address || '').trim();
        const city = String(payload.city || '').trim();
        const postal = String(payload.postal || '').trim();
        if (!firstName ||
            !lastName ||
            !email ||
            !phone ||
            !address ||
            !city ||
            !postal) {
            throw new common_1.BadRequestException('All delivery address fields (first name, last name, email, phone, address, city, postal) are required');
        }
        const rawPayment = String(payload.payment || payload.paymentMethod || 'card')
            .trim()
            .toLowerCase();
        if (rawPayment !== 'card' && rawPayment !== 'cod') {
            throw new common_1.BadRequestException('Payment method must be "card" or "cod"');
        }
        const cart = this.cartService.getCart();
        if (cart.items.length === 0) {
            throw new common_1.BadRequestException('Cannot place order with an empty shopping cart');
        }
        for (const item of cart.items) {
            const product = this.productsService.findOne(item.productId);
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for "${product.title}". Available: ${product.stock}`);
            }
        }
        for (const item of cart.items) {
            this.productsService.decreaseStock(item.productId, item.quantity);
        }
        const newOrder = {
            orderId: `VERDANT-${this.orderCounter++}`,
            customer: {
                firstName,
                lastName,
                email,
                phone,
                address,
                city,
                postal,
            },
            paymentMethod: rawPayment,
            items: cart.items.map((item) => ({ ...item })),
            subtotal: cart.subtotal,
            discount: cart.discount,
            shipping: cart.shipping,
            tax: cart.tax,
            totalPayable: cart.grandTotal,
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
        };
        this.orders.unshift(newOrder);
        this.cartService.clearCart();
        return newOrder;
    }
    findAll() {
        return [...this.orders];
    }
    findOne(orderId) {
        const cleanId = String(orderId || '').trim().toUpperCase();
        const order = this.orders.find((o) => o.orderId.toUpperCase() === cleanId);
        if (!order) {
            throw new common_1.NotFoundException(`Order "${orderId}" not found`);
        }
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map