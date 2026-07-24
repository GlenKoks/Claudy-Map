import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appConfig } from "../lib/config";

interface OnboardingState {
  /** Whether the user accepted the privacy policy, and which version. */
  privacyAccepted: boolean;
  privacyVersion: string | null;
  /** Whether we've already asked for location permission (grant or deny). */
  locationRequested: boolean;
  locationStatus: string | null;
  /** True once the persisted state has been loaded from storage. */
  hasHydrated: boolean;

  acceptPrivacy: () => void;
  setLocation: (status: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      privacyAccepted: false,
      privacyVersion: null,
      locationRequested: false,
      locationStatus: null,
      hasHydrated: false,

      acceptPrivacy: () =>
        set({
          privacyAccepted: true,
          privacyVersion: appConfig.privacyPolicyVersion,
        }),
      setLocation: (status) =>
        set({ locationRequested: true, locationStatus: status }),
      reset: () =>
        set({
          privacyAccepted: false,
          privacyVersion: null,
          locationRequested: false,
          locationStatus: null,
        }),
    }),
    {
      name: "claudy.onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        privacyAccepted: s.privacyAccepted,
        privacyVersion: s.privacyVersion,
        locationRequested: s.locationRequested,
        locationStatus: s.locationStatus,
      }),
      onRehydrateStorage: () => () => {
        useOnboardingStore.setState({ hasHydrated: true });
      },
    },
  ),
);

/** Privacy is considered accepted only if the current version was accepted. */
export function isPrivacyCurrent(state: OnboardingState): boolean {
  return (
    state.privacyAccepted &&
    state.privacyVersion === appConfig.privacyPolicyVersion
  );
}
