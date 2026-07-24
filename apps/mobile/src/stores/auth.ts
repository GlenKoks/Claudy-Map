import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import type { AuthUser, TelegramAuthResponse } from "@claudy-map/shared-types";
import { create } from "zustand";
import { getSupabase } from "../lib/supabase";

const DEV_USER_KEY = "claudy.devUser";

type AuthStatus = "loading" | "signedIn" | "signedOut";

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  /** True when signed in via the dev bypass (no real Supabase session). */
  isDev: boolean;

  hydrate: () => Promise<void>;
  signInWithTelegram: (res: TelegramAuthResponse) => Promise<void>;
  signInDev: () => Promise<void>;
  signOut: () => Promise<void>;
}

function userFromSession(session: Session): AuthUser {
  const meta = (session.user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: session.user.id,
    telegramId: typeof meta.telegram_id === "number" ? meta.telegram_id : 0,
    username: typeof meta.username === "string" ? meta.username : undefined,
    firstName: typeof meta.first_name === "string" ? meta.first_name : undefined,
    lastName: typeof meta.last_name === "string" ? meta.last_name : undefined,
    photoUrl: typeof meta.photo_url === "string" ? meta.photo_url : undefined,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  isDev: false,

  hydrate: async () => {
    try {
      const devRaw = await AsyncStorage.getItem(DEV_USER_KEY);
      if (devRaw) {
        set({
          status: "signedIn",
          user: JSON.parse(devRaw) as AuthUser,
          isDev: true,
        });
        return;
      }
      const supabase = getSupabase();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          set({
            status: "signedIn",
            user: userFromSession(data.session),
            isDev: false,
          });
          return;
        }
      }
      set({ status: "signedOut", user: null, isDev: false });
    } catch {
      set({ status: "signedOut", user: null, isDev: false });
    }
  },

  signInWithTelegram: async (res) => {
    const supabase = getSupabase();
    if (!supabase) {
      throw new Error(
        "Supabase is not configured on the client. Set EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY.",
      );
    }
    const { error } = await supabase.auth.setSession({
      access_token: res.session.accessToken,
      refresh_token: res.session.refreshToken,
    });
    if (error) throw error;
    set({ status: "signedIn", user: res.user, isDev: false });
  },

  signInDev: async () => {
    const mockUser: AuthUser = {
      id: "dev-user",
      telegramId: 0,
      username: "dev",
      firstName: "Dev",
      lastName: "User",
    };
    await AsyncStorage.setItem(DEV_USER_KEY, JSON.stringify(mockUser));
    set({ status: "signedIn", user: mockUser, isDev: true });
  },

  signOut: async () => {
    await AsyncStorage.removeItem(DEV_USER_KEY);
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    set({ status: "signedOut", user: null, isDev: false });
  },
}));
