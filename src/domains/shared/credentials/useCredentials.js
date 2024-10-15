import { create } from "zustand";

export const useCredentials = create((set) => {
  const credentials = JSON.parse(localStorage.getItem("credsFormData"));
  return {
    credentials: {
      clientId: credentials?.clientId || "",
      clientSecret: credentials?.clientSecret || "",
      refreshToken: credentials?.refreshToken || "",
      gatewayUrl: credentials?.gatewayUrl || "",
    },
    partnerAccessToken: null,
    customerAccessToken: null,
    setCredentials: (credentials) => set(() => credentials),
  };
});
