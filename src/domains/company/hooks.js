import { useMutation, useQuery } from "@tanstack/react-query";

import { partnerApiClient } from "@/lib/api";

async function fetchCompanyJsonSchema(countryCode) {
  const response = await partnerApiClient.get(
    `/api/v1/companies/schema?country_code=${countryCode}&form=address_details`
  );
  return response.data;
}

async function fetchCompany({ queryParams, bodyParams }) {
  const response = await partnerApiClient.post(
    `/api/v1/companies${queryParams}`,
    bodyParams
  );
  return response.data;
}

/**
 * Fetches JSON Schema for the company form
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
 * Estimates the cost of employment
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useCompany = () => {
  return useMutation({
    mutationFn: fetchCompany,
  });
};
