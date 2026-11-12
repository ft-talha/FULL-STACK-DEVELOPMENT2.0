import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart() {
    return {
      success: true,
      data: this.cartService.getCart(),
    };
  }

  @Post('items')
  addToCart(@Body() body: Record<string, any>) {
    const cart = this.cartService.addItem(body.productId, body.quantity ?? 1);
    return {
      success: true,
      message: 'Item added to cart',
      data: cart,
    };
  }

  @Patch('items/:productId')
  updateQuantity(
    @Param('productId') productId: string,
    @Body() body: Record<string, any>,
  ) {
    const cart = this.cartService.updateItemQuantity(productId, body.quantity);
    return {
      success: true,
      message: 'Cart quantity updated',
      data: cart,
    };
  }

  @Delete('items/:productId')
  removeFromCart(@Param('productId') productId: string) {
    const cart = this.cartService.removeItem(productId);
    return {
      success: true,
      message: 'Item removed from cart',
      data: cart,
    };
  }

  @Post('promo')
  applyPromo(@Body() body: Record<string, any>) {
    const cart = this.cartService.applyPromoCode(body.code);
    return {
      success: true,
      message: 'Promo code updated',
      data: cart,
    };
  }

  @Delete()
  clearCart() {
    const cart = this.cartService.clearCart();
    return {
      success: true,
      message: 'Cart emptied',
      data: cart,
    };
  }
}