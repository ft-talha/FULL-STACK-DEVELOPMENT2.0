import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class CartService {
  private entries: Array<{ productId: number; quantity: number }> = [
    { productId: 1, quantity: 1 },
    { productId: 2, quantity: 1 },
    { productId: 3, quantity: 2 },
  ];

  private appliedPromo: string | null = 'VERDANT10';

  private readonly promoRates: Record<string, number> = {
    VERDANT10: 0.1,
    VERDANT15: 0.15,
  };

  constructor(private readonly productsService: ProductsService) {}

  private roundMoney(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  getCart(): CartSummary {
    const validItems: CartItem[] = [];
    const validEntries: Array<{ productId: number; quantity: number }> = [];

    for (const entry of this.entries) {
      try {
        const product = this.productsService.findOne(entry.productId);
        const safeQty = Math.min(entry.quantity, product.stock);
        if (safeQty > 0) {
          validEntries.push({ productId: product.id, quantity: safeQty });
          validItems.push({
            productId: product.id,
            title: product.title,
            category: product.category,
            price: product.price,
            quantity: safeQty,
            imageUrl: product.imageUrl,
            lineTotal: this.roundMoney(product.price * safeQty),
          });
        }
      } catch {
        // Product removed from catalog; skip cleanly
      }
    }

    this.entries = validEntries;

    const subtotal = this.roundMoney(
      validItems.reduce((sum, item) => sum + item.lineTotal, 0),
    );

    const rate =
      this.appliedPromo && this.promoRates[this.appliedPromo]
        ? this.promoRates[this.appliedPromo]
        : 0;

    const discount = this.roundMoney(subtotal * rate);
    const discountedSubtotal = this.roundMoney(subtotal - discount);
    const shipping =
      discountedSubtotal === 0 || discountedSubtotal >= 75 ? 0 : 10;
    const tax = this.roundMoney(discountedSubtotal * 0.05);
    const grandTotal = this.roundMoney(discountedSubtotal + shipping + tax);

    const totalUnits = validItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: validItems,
      totalLineItems: validItems.length,
      totalUnits,
      promoCode: rate > 0 ? this.appliedPromo : null,
      subtotal,
      discount,
      shipping,
      tax,
      grandTotal,
    };
  }

  addItem(productId: number | string, quantity: number | string = 1): CartSummary {
    const product = this.productsService.findOne(productId);
    const qty = Number(quantity);

    if (Number.isNaN(qty) || qty < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const existing = this.entries.find((e) => e.productId === product.id);
    const combinedQty = (existing ? existing.quantity : 0) + Math.floor(qty);

    if (combinedQty > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} unit(s) of "${product.title}" available in stock`,
      );
    }

    if (existing) {
      existing.quantity = combinedQty;
    } else {
      this.entries.push({ productId: product.id, quantity: Math.floor(qty) });
    }

    return this.getCart();
  }

  updateItemQuantity(
    productId: number | string,
    quantity: number | string,
  ): CartSummary {
    const parsedId = Number(productId);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty)) {
      throw new BadRequestException('Invalid quantity');
    }

    const entryIndex = this.entries.findIndex((e) => e.productId === parsedId);
    if (entryIndex === -1) {
      throw new NotFoundException(`Product ${parsedId} is not in the cart`);
    }

    if (qty <= 0) {
      this.entries.splice(entryIndex, 1);
      return this.getCart();
    }

    const product = this.productsService.findOne(parsedId);
    if (Math.floor(qty) > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} unit(s) of "${product.title}" available in stock`,
      );
    }

    this.entries[entryIndex].quantity = Math.floor(qty);
    return this.getCart();
  }

  removeItem(productId: number | string): CartSummary {
    const parsedId = Number(productId);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid product ID');
    }

    const beforeCount = this.entries.length;
    this.entries = this.entries.filter((e) => e.productId !== parsedId);

    if (this.entries.length === beforeCount) {
      throw new NotFoundException(`Product ${parsedId} is not in the cart`);
    }

    return this.getCart();
  }

  applyPromoCode(code: string): CartSummary {
    const cleanCode = String(code || '').trim().toUpperCase();
    if (!cleanCode) {
      this.appliedPromo = null;
      return this.getCart();
    }

    if (!this.promoRates[cleanCode]) {
      throw new BadRequestException(
        `Invalid promo code "${cleanCode}". Valid codes: VERDANT10, VERDANT15`,
      );
    }

    this.appliedPromo = cleanCode;
    return this.getCart();
  }

  clearCart(): CartSummary {
    this.entries = [];
    return this.getCart();
  }
}