import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ProductsService } from './products/products.service';
export declare class AppController {
    private readonly appService;
    private readonly authService;
    private readonly productsService;
    constructor(appService: AppService, authService: AuthService, productsService: ProductsService);
    serveHome(res: Response): void;
    serveAuthLower(res: Response): void;
    serveAuthUpper(res: Response): void;
    serveStore(query: Record<string, any>, res: Response): void;
    serveAddProduct(res: Response): void;
    serveCart(res: Response): void;
    serveCheckout(res: Response): void;
}
