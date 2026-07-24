import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const USER_KEY = "claudy.user";

type AuthStatus = "loading" | "signedIn" | "signedOut";

/**
 * Stub user. Real authorization (Telegram + Supabase) is deferred to a later
 * stage — for now sign-in just creates a local placeholder user.
 */
export interface StubUser {
  id: string;
  displayName: string;
}

interface AuthState {
  status: AuthStatus;
  user: StubUser | null;

  hydrate: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (raw) {
        set({ status: "signedIn", user: JSON.parse(raw) as StubUser });
        return;
      }
      set({ status: "signedOut", user: null });
    } catch {
      set({ status: "signedOut", user: null });
    }
  },

  signIn: async () => {
    const user: StubUser = { id: "stub-user", displayName: "Гость" };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ status: "signedIn", user });
  },

  signOut: async () => {
    await AsyncStorage.removeItem(USER_KEY);
    set({ status: "signedOut", user: null });
  },
}));
