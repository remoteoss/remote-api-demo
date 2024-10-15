import axios from "axios";
import { getAccessToken, getClientCredentialsToken } from "@/utils/auth-utils";

export const partnerApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

partnerApiClient.interceptors.request.use(
  async (request) => {
    const accessToken = await getClientCredentialsToken();
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const customerApiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

customerApiClient.interceptors.request.use(
  async (request) => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
