import type { Product } from "@/types/product";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Cart {
    id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    items: CartItem[];
}
