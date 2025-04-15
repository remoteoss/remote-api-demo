import { useMutation, useQuery } from "@tanstack/react-query";
import { partnerApiClient, customerApiClient } from "@/lib/api";

// Fetch JSON Schema for the company form
async function fetchCompanyJsonSchema(countryCode) {
  const response = await partnerApiClient.get(
    `/api/v1/companies/schema?country_code=${countryCode}&form=address_details`
  );
  return response.data;
}

// Fetch a company
async function fetchCompany({ queryParams, bodyParams }) {
  const response = await partnerApiClient.post(
    `/api/v1/companies${queryParams}`,
    bodyParams
  );
  return response.data;
}

// Fetch the list of company managers
async function fetchCompanyManagers() {
  const response = await customerApiClient.get(`api/v1/company-managers`);
  return response.data.data.company_managers;
}

// Generate a magic link for a user
async function generateMagicLink(userId) {
  const payload = userId.userId ;
  console.log("Payload Sent to Magic Link API:", payload);
  const response = await customerApiClient.post(`api/v1/magic-link`, {
    "user_id":payload,
  });
  return response.data.data.url;
}

/**
 * Fetches JSON Schema for the company form
 * @param {string} countryCode - The country code for the schema request
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useCompanyJsonSchema = (countryCode) => {
  return useQuery({
    queryKey: ["json-schema", countryCode],
    queryFn: () => fetchCompanyJsonSchema(countryCode),
    select: (data) => data.data,
    enabled: !!countryCode,
  });
};

/**
 * Creates a company
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useCompany = () => {
  return useMutation({
    mutationFn: fetchCompany,
  });
};

/**
 * Fetches the list of company managers
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useFetchCompanyManagers = () => {
  return useMutation({
    mutationFn: fetchCompanyManagers,
  });
};

/**
 * Generates a magic link for a user
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useGenerateMagicLink = () => {
  return useMutation({
    mutationFn: ({ userId }) => generateMagicLink({ userId }),
  });
};

