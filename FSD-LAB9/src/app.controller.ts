import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ProductsService } from './products/products.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  serveHome(@Res() res: Response) {
    return res.redirect('/store.html');
  }

  @Get('auth.html')
  serveAuthLower(@Res() res: Response) {
    const filePath = this.appService.resolveHtmlPage('auth.html');
    return res.sendFile(filePath);
  }

  @Get('Auth.html')
  serveAuthUpper(@Res() res: Response) {
    const filePath = this.appService.resolveHtmlPage('Auth.html');
    return res.sendFile(filePath);
  }

  @Get('store.html')
  serveStore(
    @Query() query: Record<string, any>,
    @Res() res: Response,
  ) {
    if (query.name && query.email && query.password) {
      try {
        this.authService.register(query.name, query.email, query.password);
      } catch {
        // Keep storefront accessible
      }
      return res.redirect('/store.html');
    }

    if (!query.name && query.email && query.password) {
      try {
        this.authService.login(query.email, query.password);
      } catch {
        // Keep storefront accessible
      }
      return res.redirect('/store.html');
    }

    if (query.title && query.price) {
      try {
        this.productsService.create(query);
      } catch {
        // Keep storefront accessible
      }
      return res.redirect('/store.html');
    }

    const filePath = this.appService.resolveHtmlPage('store.html');
    return res.sendFile(filePath);
  }

  @Get('add-product.html')
  serveAddProduct(@Res() res: Response) {
    const filePath = this.appService.resolveHtmlPage('add-product.html');
    return res.sendFile(filePath);
  }

  @Get('cart.html')
  serveCart(@Res() res: Response) {
    const filePath = this.appService.resolveHtmlPage('cart.html');
    return res.sendFile(filePath);
  }

  @Get('checkout.html')
  serveCheckout(@Res() res: Response) {
    const filePath = this.appService.resolveHtmlPage('checkout.html');
    return res.sendFile(filePath);
  }
}