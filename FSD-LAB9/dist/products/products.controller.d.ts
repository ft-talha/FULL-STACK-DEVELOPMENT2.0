import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(category?: string, search?: string): {
        success: boolean;
        data: import("./products.service").Product[];
    };
    getProductById(id: string): {
        success: boolean;
        data: import("./products.service").Product;
    };
    createProduct(body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./products.service").Product;
    };
    updateProduct(id: string, body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./products.service").Product;
    };
    deleteProduct(id: string): {
        deleted: boolean;
        id: number;
        success: boolean;
    };
}
