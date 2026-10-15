import { apiClient } from "@/lib/api/client";
import type {
  ApiResponse,
  PaginatedResponse,
} from "@/types/api-response";
import type {
  GetProductsParams,
  Product,
} from "@/types/product";

export const productService = {
  async getProducts(
    params: GetProductsParams = {}
  ) {
    const queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.set("search", params.search);
    }

    if (params.category !== undefined) {
      queryParams.set("category", String(params.category));
    }

    if (params.sort) {
      queryParams.set("sort", params.sort);
    }

    if (params.direction) {
      queryParams.set("direction", params.direction);
    }

    if (params.page !== undefined) {
      queryParams.set("page", String(params.page));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/products?${queryString}`
      : "/products";

    return apiClient<ApiResponse<PaginatedResponse<Product>>>(endpoint);
  },

  async getProductById(id: number) {
    return apiClient<ApiResponse<Product>>(
      `/products/${id}`
    );
  },
  
  async createProduct(token: string, data: FormData) {
      return apiClient<ApiResponse<Product>>(
          "/admin/products",
          {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              body: data,
          }
      );
  },

  async updateProduct(
      token: string,
      productId: number,
      data: FormData
  ) {
      data.set("_method", "PUT");

      return apiClient<ApiResponse<Product>>(
          `/admin/products/${productId}`,
          {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              body: data,
          }
      );
  },

  async deleteProduct(token: string, productId: number) {
      return apiClient<ApiResponse<null>>(
          `/admin/products/${productId}`,
          {
              method: "DELETE",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );
  },

};
