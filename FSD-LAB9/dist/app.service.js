"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path_1 = require("path");
let AppService = class AppService {
    constructor() {
        this.publicDir = (0, path_1.join)(process.cwd(), 'public');
    }
    resolveHtmlPage(requestedFile) {
        const directPath = (0, path_1.join)(this.publicDir, requestedFile);
        if (fs.existsSync(directPath)) {
            return directPath;
        }
        if (requestedFile.toLowerCase() === 'auth.html') {
            const upperAuthPath = (0, path_1.join)(this.publicDir, 'Auth.html');
            if (fs.existsSync(upperAuthPath)) {
                return upperAuthPath;
            }
            const lowerAuthPath = (0, path_1.join)(this.publicDir, 'auth.html');
            if (fs.existsSync(lowerAuthPath)) {
                return lowerAuthPath;
            }
        }
        throw new common_1.NotFoundException(`HTML file "${requestedFile}" not found inside public/ directory`);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map