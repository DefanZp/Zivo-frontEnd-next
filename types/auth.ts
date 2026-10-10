export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface CurrentUserResponse {
    success: boolean;
    data: User;
}

export interface MessageResponse {
    message: string;
}

