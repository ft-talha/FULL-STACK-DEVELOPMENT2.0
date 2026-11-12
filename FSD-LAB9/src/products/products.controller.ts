import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return {
      success: true,
      data: this.productsService.findAll(category, search),
    };
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return {
      success: true,
      data: this.productsService.findOne(id),
    };
  }

  @Post()
  createProduct(@Body() body: Record<string, any>) {
    const product = this.productsService.create(body);
    return {
      success: true,
      message: 'Product published successfully',
      data: product,
    };
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ) {
    const product = this.productsService.update(id, body);
    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return {
      success: true,
      ...this.productsService.remove(id),
    };
  }
}