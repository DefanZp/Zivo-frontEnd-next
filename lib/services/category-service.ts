import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type { ProductCategory } from "@/types/product";

export const categoryService = {
    getCategories() {
        return apiClient<ApiResponse<ProductCategory[]>>(
            "/categories"
        );
    },
};
