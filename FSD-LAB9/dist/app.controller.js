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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const auth_service_1 = require("./auth/auth.service");
const products_service_1 = require("./products/products.service");
let AppController = class AppController {
    constructor(appService, authService, productsService) {
        this.appService = appService;
        this.authService = authService;
        this.productsService = productsService;
    }
    serveHome(res) {
        return res.redirect('/store.html');
    }
    serveAuthLower(res) {
        const filePath = this.appService.resolveHtmlPage('auth.html');
        return res.sendFile(filePath);
    }
    serveAuthUpper(res) {
        const filePath = this.appService.resolveHtmlPage('Auth.html');
        return res.sendFile(filePath);
    }
    serveStore(query, res) {
        if (query.name && query.email && query.password) {
            try {
                this.authService.register(query.name, query.email, query.password);
            }
            catch {
            }
            return res.redirect('/store.html');
        }
        if (!query.name && query.email && query.password) {
            try {
                this.authService.login(query.email, query.password);
            }
            catch {
            }
            return res.redirect('/store.html');
        }
        if (query.title && query.price) {
            try {
                this.productsService.create(query);
            }
            catch {
            }
            return res.redirect('/store.html');
        }
        const filePath = this.appService.resolveHtmlPage('store.html');
        return res.sendFile(filePath);
    }
    serveAddProduct(res) {
        const filePath = this.appService.resolveHtmlPage('add-product.html');
        return res.sendFile(filePath);
    }
    serveCart(res) {
        const filePath = this.appService.resolveHtmlPage('cart.html');
        return res.sendFile(filePath);
    }
    serveCheckout(res) {
        const filePath = this.appService.resolveHtmlPage('checkout.html');
        return res.sendFile(filePath);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveHome", null);
__decorate([
    (0, common_1.Get)('auth.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveAuthLower", null);
__decorate([
    (0, common_1.Get)('Auth.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveAuthUpper", null);
__decorate([
    (0, common_1.Get)('store.html'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveStore", null);
__decorate([
    (0, common_1.Get)('add-product.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveAddProduct", null);
__decorate([
    (0, common_1.Get)('cart.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveCart", null);
__decorate([
    (0, common_1.Get)('checkout.html'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "serveCheckout", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        auth_service_1.AuthService,
        products_service_1.ProductsService])
], AppController);
//# sourceMappingURL=app.controller.js.map