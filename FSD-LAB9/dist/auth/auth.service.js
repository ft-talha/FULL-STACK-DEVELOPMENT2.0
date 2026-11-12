"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor() {
        this.users = [
            {
                id: 1,
                name: 'curator',
                email: 'curator@verdant.com',
                password: 'verdant123',
            },
            {
                id: 2,
                name: 'Aisha Khan',
                email: 'aisha.khan@domain.com',
                password: 'Password123',
            },
        ];
        this.nextId = 3;
        this.activeUser = {
            id: 1,
            name: 'curator',
            email: 'curator@verdant.com',
        };
    }
    login(email, password) {
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPassword = String(password || '');
        if (!cleanEmail || !cleanPassword) {
            throw new common_1.BadRequestException('Email and password are required');
        }
        const user = this.users.find((u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        this.activeUser = safeUser;
        return {
            success: true,
            message: 'Signed in successfully',
            user: safeUser,
        };
    }
    register(name, email, password) {
        const cleanName = String(name || '').trim();
        const cleanEmail = String(email || '').trim().toLowerCase();
        const cleanPassword = String(password || '');
        if (cleanName.length < 2) {
            throw new common_1.BadRequestException('Full name must be at least 2 characters');
        }
        if (!cleanEmail || !cleanEmail.includes('@')) {
            throw new common_1.BadRequestException('Please provide a valid email address');
        }
        if (cleanPassword.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long');
        }
        const exists = this.users.some((u) => u.email.toLowerCase() === cleanEmail);
        if (exists) {
            throw new common_1.ConflictException('An account with this email already exists');
        }
        const newUser = {
            id: this.nextId++,
            name: cleanName,
            email: cleanEmail,
            password: cleanPassword,
        };
        this.users.push(newUser);
        const safeUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };
        this.activeUser = safeUser;
        return {
            success: true,
            message: 'Account registered successfully',
            user: safeUser,
        };
    }
    getActiveUser() {
        return this.activeUser;
    }
    logout() {
        this.activeUser = null;
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }
    getAllUsers() {
        return this.users.map(({ id, name, email }) => ({ id, name, email }));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map