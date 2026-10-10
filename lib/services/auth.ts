import { AuthResponse, CurrentUserResponse, LoginRequest, MessageResponse, RegisterRequest } from "@/types/auth";
import { apiClient } from "../api/client";

export const authService = {
    register(data: RegisterRequest) {
        return apiClient<AuthResponse>("/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    login(data: LoginRequest) {
        return apiClient<AuthResponse>("/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    logout(token: string) {
        return apiClient<MessageResponse>("/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },

    getCurrentUser() {
        return apiClient<CurrentUserResponse>("/user/profile", {
            method: "GET",
        })
    },

    resendVerificationEmail() {
        return apiClient<MessageResponse>("/email/verification-notification", {
            method: "POST",
        })
    }
}