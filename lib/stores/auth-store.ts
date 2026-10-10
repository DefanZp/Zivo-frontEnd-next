import { User } from "@/types/auth";
import { createJSONStorage, persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla"


export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthReady: boolean;

    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    setAuthReady: (isReady: boolean) => void;
}

export const createAuthStore = () => {
    return createStore<AuthState>()(
        persist(
            (set) => ({
                user: null,
                token: null,
                isAuthReady: false,

                setAuth: (user: User, token: string) => {
                    set({
                        user,
                        token,
                        isAuthReady: true,
                    });
                },

                clearAuth: () => {
                    set({
                        user: null,
                        token: null,
                        isAuthReady: true,
                    });
                },

                setAuthReady: (isReady: boolean) => {
                    set({
                        isAuthReady: isReady,
                    });
                },
            }),
            {
                name: "zivo-auth",
                storage: createJSONStorage(() => localStorage),
                skipHydration: true,
                partialize: (state) => ({
                    user: state.user,
                    token: state.token
                }),
            }
        )
    )
} 