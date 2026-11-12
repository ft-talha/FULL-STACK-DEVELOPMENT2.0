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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(productsService) {
        this.productsService = productsService;
        this.entries = [
            { productId: 1, quantity: 1 },
            { productId: 2, quantity: 1 },
            { productId: 3, quantity: 2 },
        ];
        this.appliedPromo = 'VERDANT10';
        this.promoRates = {
            VERDANT10: 0.1,
            VERDANT15: 0.15,
        };
    }
    roundMoney(value) {
        return Math.round((value + Number.EPSILON) * 100) / 100;
    }
    getCart() {
        const validItems = [];
        const validEntries = [];
        for (const entry of this.entries) {
            try {
                const product = this.productsService.findOne(entry.productId);
                const safeQty = Math.min(entry.quantity, product.stock);
                if (safeQty > 0) {
                    validEntries.push({ productId: product.id, quantity: safeQty });
                    validItems.push({
                        productId: product.id,
                        title: product.title,
                        category: product.category,
                        price: product.price,
                        quantity: safeQty,
                        imageUrl: product.imageUrl,
                        lineTotal: this.roundMoney(product.price * safeQty),
                    });
                }
            }
            catch {
            }
        }
        this.entries = validEntries;
        const subtotal = this.roundMoney(validItems.reduce((sum, item) => sum + item.lineTotal, 0));
        const rate = this.appliedPromo && this.promoRates[this.appliedPromo]
            ? this.promoRates[this.appliedPromo]
            : 0;
        const discount = this.roundMoney(subtotal * rate);
        const discountedSubtotal = this.roundMoney(subtotal - discount);
        const shipping = discountedSubtotal === 0 || discountedSubtotal >= 75 ? 0 : 10;
        const tax = this.roundMoney(discountedSubtotal * 0.05);
        const grandTotal = this.roundMoney(discountedSubtotal + shipping + tax);
        const totalUnits = validItems.reduce((sum, item) => sum + item.quantity, 0);
        return {
            items: validItems,
            totalLineItems: validItems.length,
            totalUnits,
            promoCode: rate > 0 ? this.appliedPromo : null,
            subtotal,
            discount,
            shipping,
            tax,
            grandTotal,
        };
    }
    addItem(productId, quantity = 1) {
        const product = this.productsService.findOne(productId);
        const qty = Number(quantity);
        if (Number.isNaN(qty) || qty < 1) {
            throw new common_1.BadRequestException('Quantity must be at least 1');
        }
        const existing = this.entries.find((e) => e.productId === product.id);
        const combinedQty = (existing ? existing.quantity : 0) + Math.floor(qty);
        if (combinedQty > product.stock) {
            throw new common_1.BadRequestException(`Only ${product.stock} unit(s) of "${product.title}" available in stock`);
        }
        if (existing) {
            existing.quantity = combinedQty;
        }
        else {
            this.entries.push({ productId: product.id, quantity: Math.floor(qty) });
        }
        return this.getCart();
    }
    updateItemQuantity(productId, quantity) {
        const parsedId = Number(productId);
        if (Number.isNaN(parsedId) || parsedId <= 0) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const qty = Number(quantity);
        if (Number.isNaN(qty)) {
            throw new common_1.BadRequestException('Invalid quantity');
        }
        const entryIndex = this.entries.findIndex((e) => e.productId === parsedId);
        if (entryIndex === -1) {
            throw new common_1.NotFoundException(`Product ${parsedId} is not in the cart`);
        }
        if (qty <= 0) {
            this.entries.splice(entryIndex, 1);
            return this.getCart();
        }
        const product = this.productsService.findOne(parsedId);
        if (Math.floor(qty) > product.stock) {
            throw new common_1.BadRequestException(`Only ${product.stock} unit(s) of "${product.title}" available in stock`);
        }
        this.entries[entryIndex].quantity = Math.floor(qty);
        return this.getCart();
    }
    removeItem(productId) {
        const parsedId = Number(productId);
        if (Number.isNaN(parsedId) || parsedId <= 0) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const beforeCount = this.entries.length;
        this.entries = this.entries.filter((e) => e.productId !== parsedId);
        if (this.entries.length === beforeCount) {
            throw new common_1.NotFoundException(`Product ${parsedId} is not in the cart`);
        }
        return this.getCart();
    }
    applyPromoCode(code) {
        const cleanCode = String(code || '').trim().toUpperCase();
        if (!cleanCode) {
            this.appliedPromo = null;
            return this.getCart();
        }
        if (!this.promoRates[cleanCode]) {
            throw new common_1.BadRequestException(`Invalid promo code "${cleanCode}". Valid codes: VERDANT10, VERDANT15`);
        }
        this.appliedPromo = cleanCode;
        return this.getCart();
    }
    clearCart() {
        this.entries = [];
        return this.getCart();
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map