import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type {
    Address,
    CreateAddressRequest,
} from "@/types/address";

export const addressService = {
    getAddresses(token: string) {
        return apiClient<ApiResponse<Address[]>>(
            "/user/addresses",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },

    createAddress(
        token: string,
        data: CreateAddressRequest
    ) {
        return apiClient<ApiResponse<Address>>(
            "/user/addresses",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );
    },

    updateAddress(
        token: string,
        addressId: number,
        data: CreateAddressRequest
    ) {
        return apiClient<ApiResponse<Address>>(
            `/user/addresses/${addressId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );
    },

    setDefaultAddress(token: string, addressId: number) {
        return apiClient<ApiResponse<Address>>(
            `/user/addresses/${addressId}/default`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({}),
            }
        );
    },

    deleteAddress(token: string, addressId: number) {
        return apiClient<ApiResponse<null>>(
            `/user/addresses/${addressId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    },
};