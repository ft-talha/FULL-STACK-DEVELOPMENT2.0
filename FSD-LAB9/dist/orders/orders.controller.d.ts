import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    placeOrder(body: Record<string, any>): {
        success: boolean;
        message: string;
        data: import("./orders.service").OrderRecord;
    };
    getAllOrders(): {
        success: boolean;
        data: import("./orders.service").OrderRecord[];
    };
    getOrderById(orderId: string): {
        success: boolean;
        data: import("./orders.service").OrderRecord;
    };
}
