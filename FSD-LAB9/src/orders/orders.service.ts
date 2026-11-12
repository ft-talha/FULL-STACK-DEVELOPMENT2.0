import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class OrdersService {
  private orders: OrderRecord[] = [];
  private orderCounter = 9912;

  constructor(
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  createOrder(payload: Record<string, any>): OrderRecord {
    const firstName = String(
      payload.first_name || payload.firstName || '',
    ).trim();
    const lastName = String(
      payload.last_name || payload.lastName || '',
    ).trim();
    const email = String(payload.email || '').trim();
    const phone = String(payload.phone || '').trim();
    const address = String(payload.address || '').trim();
    const city = String(payload.city || '').trim();
    const postal = String(payload.postal || '').trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postal
    ) {
      throw new BadRequestException(
        'All delivery address fields (first name, last name, email, phone, address, city, postal) are required',
      );
    }

    const rawPayment = String(
      payload.payment || payload.paymentMethod || 'card',
    )
      .trim()
      .toLowerCase();

    if (rawPayment !== 'card' && rawPayment !== 'cod') {
      throw new BadRequestException('Payment method must be "card" or "cod"');
    }

    const cart = this.cartService.getCart();
    if (cart.items.length === 0) {
      throw new BadRequestException(
        'Cannot place order with an empty shopping cart',
      );
    }

    for (const item of cart.items) {
      const product = this.productsService.findOne(item.productId);
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.title}". Available: ${product.stock}`,
        );
      }
    }

    for (const item of cart.items) {
      this.productsService.decreaseStock(item.productId, item.quantity);
    }

    const newOrder: OrderRecord = {
      orderId: `VERDANT-${this.orderCounter++}`,
      customer: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postal,
      },
      paymentMethod: rawPayment,
      items: cart.items.map((item) => ({ ...item })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping: cart.shipping,
      tax: cart.tax,
      totalPayable: cart.grandTotal,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.cartService.clearCart();

    return newOrder;
  }

  findAll(): OrderRecord[] {
    return [...this.orders];
  }

  findOne(orderId: string): OrderRecord {
    const cleanId = String(orderId || '').trim().toUpperCase();
    const order = this.orders.find((o) => o.orderId.toUpperCase() === cleanId);
    if (!order) {
      throw new NotFoundException(`Order "${orderId}" not found`);
    }
    return order;
  }
}