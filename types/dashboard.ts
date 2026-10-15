
export interface DashboardStatistics {
    total_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number | string;
}

export interface DashboardOrder {
    id: number;
    user_id: number;
    recipient_name: string;
    total_price: number | string;
    status: string;
    created_at: string;
}

export interface DashboardData {
    statistic_data: DashboardStatistics;
    latest_orders_data: DashboardOrder[];
}
