import type { Payment } from "@/types/payment";

export interface CheckoutItemRequest {
    product_id: number;
    quantity: number;
}

export interface CheckoutRequest {
    address_id: number;
    items: CheckoutItemRequest[];
}

export interface CheckoutOrder {
    id: number;
    payment: Payment;
}