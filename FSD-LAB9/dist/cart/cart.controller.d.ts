import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(): {
        success: boolean;
        data: import("./cart.service").CartSummary;
    };
    addToCart(body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./cart.service").CartSummary;
    };
    updateQuantity(productId: string, body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./cart.service").CartSummary;
    };
    removeFromCart(productId: string): {
        success: boolean;
        message: string;
        data: import("./cart.service").CartSummary;
    };
    applyPromo(body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./cart.service").CartSummary;
    };
    clearCart(): {
        success: boolean;
        message: string;
        data: import("./cart.service").CartSummary;
    };
}
