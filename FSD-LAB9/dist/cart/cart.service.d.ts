import { ProductsService } from '../products/products.service';
export interface CartItem {
    productId: number;
    title: string;
    category: string;
    price: number;
    quantity: number;
    imageUrl: string;
    lineTotal: number;
}
export interface CartSummary {
    items: CartItem[];
    totalLineItems: number;
    totalUnits: number;
    promoCode: string | null;
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    grandTotal: number;
}
export declare class CartService {
    private readonly productsService;
    private entries;
    private appliedPromo;
    private readonly promoRates;
    constructor(productsService: ProductsService);
    private roundMoney;
    getCart(): CartSummary;
    addItem(productId: number | string, quantity?: number | string): CartSummary;
    updateItemQuantity(productId: number | string, quantity: number | string): CartSummary;
    removeItem(productId: number | string): CartSummary;
    applyPromoCode(code: string): CartSummary;
    clearCart(): CartSummary;
}
