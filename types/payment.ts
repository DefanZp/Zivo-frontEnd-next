export interface Payment {
    id: number;
    order_id: number;
    gateway: string;
    gateway_order_id: string;
    gateway_transaction_id: string | null;
    payment_method: string;
    payment_status: string;
    amount: string;
    paid_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface SnapToken {
    snap_token: string;
}