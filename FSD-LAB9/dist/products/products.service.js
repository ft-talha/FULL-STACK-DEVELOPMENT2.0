"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
let ProductsService = class ProductsService {
    constructor() {
        this.defaultImage = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';
        this.products = [
            {
                id: 1,
                title: 'Wild Lavender Soy Candle',
                category: 'Aromatherapy',
                price: 28.0,
                originalPrice: 35.0,
                stock: 25,
                badge: 'BESTSELLER',
                rating: 4.8,
                reviewsCount: 48,
                imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
                description: 'Hand-poured soy candle infused with wild organic lavender essential oil.',
            },
            {
                id: 2,
                title: 'Artisan Earth Ceramic Vase',
                category: 'Ceramics',
                price: 52.0,
                originalPrice: null,
                stock: 15,
                badge: 'NEW',
                rating: 5.0,
                reviewsCount: 92,
                imageUrl: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80',
                description: 'Wheel-thrown stoneware vase finished with a raw natural mineral glaze.',
            },
            {
                id: 3,
                title: 'Sage Organic Linen Blanket',
                category: 'Textiles',
                price: 64.0,
                originalPrice: 80.0,
                stock: 18,
                badge: '20% OFF',
                rating: 4.7,
                reviewsCount: 31,
                imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
                description: '100% European flax linen throw blanket naturally dyed with botanical sage.',
            },
            {
                id: 4,
                title: 'Handcrafted Terracotta Pot',
                category: 'Botanicals',
                price: 38.0,
                originalPrice: null,
                stock: 30,
                badge: null,
                rating: 4.9,
                reviewsCount: 115,
                imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
                description: 'Breathable porous clay planter crafted for healthy indoor botanicals.',
            },
            {
                id: 5,
                title: 'Rustic Stoneware Mug Set',
                category: 'Ceramics',
                price: 42.0,
                originalPrice: null,
                stock: 20,
                badge: 'NEW',
                rating: 4.6,
                reviewsCount: 22,
                imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
                description: 'Set of two speckled stoneware mugs fired at high kiln temperature.',
            },
            {
                id: 6,
                title: 'Eucalyptus Oil Diffuser',
                category: 'Aromatherapy',
                price: 46.0,
                originalPrice: null,
                stock: 22,
                badge: null,
                rating: 4.8,
                reviewsCount: 57,
                imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=600&q=80',
                description: 'Pure steam-distilled eucalyptus oil paired with natural rattan reeds.',
            },
            {
                id: 7,
                title: 'Organic Cotton Throw Pillow',
                category: 'Textiles',
                price: 34.0,
                originalPrice: null,
                stock: 28,
                badge: null,
                rating: 4.5,
                reviewsCount: 18,
                imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
                description: 'GOTS-certified organic woven cotton cushion cover with plush insert.',
            },
            {
                id: 8,
                title: 'Monstera Deliciosa Plant',
                category: 'Botanicals',
                price: 29.0,
                originalPrice: null,
                stock: 14,
                badge: 'NEW',
                rating: 4.9,
                reviewsCount: 64,
                imageUrl: 'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=600&q=80',
                description: 'Lush nursery-grown Monstera Deliciosa ready for bright indirect light.',
            },
        ];
        this.nextId = 9;
    }
    findAll(category, search) {
        let result = [...this.products];
        if (category && category.trim() && category.toLowerCase() !== 'all') {
            const targetCat = category.trim().toLowerCase();
            result = result.filter((p) => p.category.toLowerCase() === targetCat);
        }
        if (search && search.trim()) {
            const term = search.trim().toLowerCase();
            result = result.filter((p) => p.title.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term));
        }
        return result;
    }
    findOne(id) {
        const parsedId = Number(id);
        if (Number.isNaN(parsedId) || parsedId <= 0) {
            throw new common_1.BadRequestException('Invalid product ID');
        }
        const product = this.products.find((p) => p.id === parsedId);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${parsedId} not found`);
        }
        return product;
    }
    create(payload) {
        const title = String(payload.title || '').trim();
        const category = String(payload.category || '').trim();
        const price = Number(payload.price);
        const rawOriginal = payload.original_price !== undefined
            ? payload.original_price
            : payload.originalPrice;
        const stock = payload.stock !== undefined && payload.stock !== ''
            ? Number(payload.stock)
            : 20;
        if (title.length < 3) {
            throw new common_1.BadRequestException('Product title must be at least 3 characters long');
        }
        if (!category) {
            throw new common_1.BadRequestException('Product category is required');
        }
        if (Number.isNaN(price) || price <= 0) {
            throw new common_1.BadRequestException('Product price must be greater than 0');
        }
        if (Number.isNaN(stock) || stock < 1) {
            throw new common_1.BadRequestException('Product stock must be at least 1');
        }
        let originalPrice = null;
        if (rawOriginal !== undefined && rawOriginal !== null && rawOriginal !== '') {
            const parsedOriginal = Number(rawOriginal);
            if (Number.isNaN(parsedOriginal) || parsedOriginal < 0) {
                throw new common_1.BadRequestException('Original price cannot be negative');
            }
            originalPrice = parsedOriginal > 0 ? parsedOriginal : null;
        }
        const rawImage = String(payload.image_url || payload.imageUrl || '').trim();
        const imageUrl = rawImage || this.defaultImage;
        const isNewArrival = payload.new_arrival === true ||
            payload.new_arrival === 'on' ||
            payload.new_arrival === 'true' ||
            payload.newArrival === true;
        const newProduct = {
            id: this.nextId++,
            title,
            category,
            price: Math.round((price + Number.EPSILON) * 100) / 100,
            originalPrice,
            stock: Math.floor(stock),
            badge: isNewArrival ? 'NEW ARRIVAL' : null,
            rating: 5.0,
            reviewsCount: 0,
            imageUrl,
            description: String(payload.description || '').trim(),
        };
        this.products.push(newProduct);
        return newProduct;
    }
    update(id, payload) {
        const product = this.findOne(id);
        if (payload.title !== undefined) {
            const title = String(payload.title).trim();
            if (title.length < 3) {
                throw new common_1.BadRequestException('Product title must be at least 3 characters long');
            }
            product.title = title;
        }
        if (payload.category !== undefined) {
            const category = String(payload.category).trim();
            if (!category) {
                throw new common_1.BadRequestException('Product category cannot be empty');
            }
            product.category = category;
        }
        if (payload.price !== undefined) {
            const price = Number(payload.price);
            if (Number.isNaN(price) || price <= 0) {
                throw new common_1.BadRequestException('Price must be greater than 0');
            }
            product.price = Math.round((price + Number.EPSILON) * 100) / 100;
        }
        if (payload.stock !== undefined) {
            const stock = Number(payload.stock);
            if (Number.isNaN(stock) || stock < 0) {
                throw new common_1.BadRequestException('Stock cannot be negative');
            }
            product.stock = Math.floor(stock);
        }
        if (payload.description !== undefined) {
            product.description = String(payload.description).trim();
        }
        if (payload.imageUrl !== undefined || payload.image_url !== undefined) {
            const img = String(payload.imageUrl ?? payload.image_url).trim();
            if (img) {
                product.imageUrl = img;
            }
        }
        return product;
    }
    remove(id) {
        const product = this.findOne(id);
        this.products = this.products.filter((p) => p.id !== product.id);
        return { deleted: true, id: product.id };
    }
    decreaseStock(productId, quantity) {
        const product = this.findOne(productId);
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        if (product.stock < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock for "${product.title}". Available: ${product.stock}`);
        }
        product.stock -= quantity;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map