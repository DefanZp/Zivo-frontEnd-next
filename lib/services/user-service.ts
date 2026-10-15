
import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api-response";
import type { User } from "@/types/auth";

type UpdateProfileRequest = Pick<User, "name" | "email">;

export const userService = {
    updateProfile(
        token: string,
        data: UpdateProfileRequest
    ) {
        return apiClient<ApiResponse<User>>(
            "/user/profile",
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );
    },
};
