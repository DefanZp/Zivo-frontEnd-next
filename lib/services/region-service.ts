import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type { Region } from "@/types/region";

export const regionService = {
    getProvinces() {
        return apiClient<ApiResponse<Region[]>>(
            "/regions/provinces",
            { method: "GET" }
        );
    },

    getCities(provinceId: string) {
        return apiClient<ApiResponse<Region[]>>(
            `/regions/cities/${provinceId}`,
            { method: "GET" }
        );
    },

    getDistricts(cityId: string) {
        return apiClient<ApiResponse<Region[]>>(
            `/regions/districts/${cityId}`,
            { method: "GET" }
        );
    },

    getSubdistricts(districtId: string) {
        return apiClient<ApiResponse<Region[]>>(
            `/regions/subdistricts/${districtId}`,
            { method: "GET" }
        );
    },
};