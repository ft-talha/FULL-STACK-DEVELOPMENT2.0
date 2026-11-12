import { CartItem, CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
export interface OrderRecord {
    orderId: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postal: string;
    };
    paymentMethod: 'card' | 'cod';
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    totalPayable: number;
    status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
}
export declare class OrdersService {
    private readonly cartService;
    private readonly productsService;
    private orders;
    private orderCounter;
    constructor(cartService: CartService, productsService: ProductsService);
    createOrder(payload: Record<string, any>): OrderRecord;
    findAll(): OrderRecord[];
    findOne(orderId: string): OrderRecord;
}
