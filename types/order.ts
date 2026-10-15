
import type { Product } from "@/types/product";

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: string | number;
}

export interface OrderPayment {
    id: number;
    payment_status: string;
    payment_method: string | null;
    amount: string | number;
    gateway_order_id?: string | null;
}

export interface Order {
    id: number;
    user_id: number;

    recipient_name: string;
    phone: string;
    full_address: string;

    province_id: string | number;
    province_name: string;
    city_id: string | number;
    city_name: string;
    district_id: string | number;
    district_name: string;

    subdistrict_id: string | number | null;
    subdistrict_name: string | null;
    postal_code: string;

    latitude: number | null;
    longitude: number | null;

    total_price: string | number;
    status: OrderStatus;

    created_at: string;
    updated_at: string;

    items: OrderItem[];
    payment?: OrderPayment | null;
}

export type OrderStatus =
    | "pending"
    | "processing"
    | "completed"
    | "cancelled";

export interface PaginatedResponse<T> {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
}
