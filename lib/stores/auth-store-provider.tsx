"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useStore } from "zustand";

import { createAuthStore } from "./auth-store";
import type { AuthState } from "./auth-store";

type AuthStore = ReturnType<typeof createAuthStore>;

const AuthStoreContext = createContext<AuthStore | null>(null);

export function AuthStoreProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [store] = useState(() => createAuthStore());

    useEffect(() => {
        async function restoreAuth() {
            try {
                await store.persist.rehydrate();
            } catch (error) {
                console.error(
                    "Failed to restore authentication:",
                    error
                );
            } finally {
                store.getState().setAuthReady(true);
            }
        }

        void restoreAuth();
    }, [store]);

    return (
        <AuthStoreContext.Provider value={store}>
            {children}
        </AuthStoreContext.Provider>
    );
}

export function useAuthStore<T>(
    selector: (state: AuthState) => T
): T {
    const store = useContext(AuthStoreContext);

    if (!store) {
        throw new Error(
            "useAuthStore must be used within an AuthStoreProvider"
        );
    }

    return useStore(store, selector);
}