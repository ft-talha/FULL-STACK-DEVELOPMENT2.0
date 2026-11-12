export interface Product {
    id: number;
    title: string;
    category: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    badge: string | null;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    description: string;
}
export declare class ProductsService {
    private readonly defaultImage;
    private products;
    private nextId;
    findAll(category?: string, search?: string): Product[];
    findOne(id: number | string): Product;
    create(payload: Record<string, any>): Product;
    update(id: number | string, payload: Record<string, any>): Product;
    remove(id: number | string): {
        deleted: boolean;
        id: number;
    };
    decreaseStock(productId: number, quantity: number): void;
}
