import { useMutation, useQuery } from "@tanstack/react-query";

import { partnerApiClient } from "@/lib/api";

async function fetchCountries() {
  const response = await partnerApiClient.get(
    "/api/v1/cost-calculator/countries"
  );
  return response.data;
}

async function fetchEstimation(payload) {
  const response = await partnerApiClient.post(
    `/api/v1/cost-calculator/estimation`,
    payload
  );
  return response.data;
}

/**
 * Fetches the supported countries list
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    select: (data) => data.data,
  });
};

/**
 * Estimates the cost of employment
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
export const useEstimation = () => {
  return useMutation({
    mutationFn: fetchEstimation,
  });
};
