import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MyFormComponent from './MyFormComponent';
import { GlobalStyle } from './App.styled.js';

const getAccessToken = (() => {
  let cachedToken = null;
  let tokenExpiry = null;

  return async () => {
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
      return cachedToken;
    }

    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
    const refreshToken = process.env.REACT_APP_REFRESH_TOKEN;
    const gatewayUrl = process.env.REACT_APP_GATEWAY_URL;

    const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
    try {
      const response = await axios.post(
        `${gatewayUrl}/auth/oauth2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );

      cachedToken = response.data.access_token;
      tokenExpiry = new Date(new Date().getTime() + 1000 * 60 * 59); // Set expiry for 59 minutes later

      return cachedToken;
    } catch (error) {
      console.error('Error fetching access token:', error);
      return null;
    }
  };
})();

const App = () => {
  const [jsonSchema, setJsonSchema] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [employmentId, setEmploymentId] = useState(null);
  const [isContractDetails, setIsContractDetails] = useState(false);

  const fetchSchema = useCallback(async (endpoint) => {
    const token = await getAccessToken();

    if (token) {
      setAccessToken(token);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_GATEWAY_URL}${endpoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJsonSchema(response.data.data);
      } catch (error) {
        console.error('Error fetching JSON schema:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isContractDetails) {
      fetchSchema('/v1/countries/GBR/employment_basic_information');
    }
  }, [fetchSchema, isContractDetails]);

  useEffect(() => {
    if (employmentId && isContractDetails) {
      fetchSchema('/v1/countries/GBR/contract_details');
    }
  }, [employmentId, isContractDetails, fetchSchema]);

  const handleSubmit = async (jsonValues) => {
    try {
      if (!isContractDetails) {
        // Create employment
        const postResponse = await axios.post(
          `${process.env.REACT_APP_GATEWAY_URL}/v1/employments`,
          {
            basic_information: {
              email: jsonValues.email,
              has_seniority_date: jsonValues.has_seniority_date,
              job_title: jsonValues.job_title,
              name: jsonValues.name,
              provisional_start_date: jsonValues.provisional_start_date,
            },
            country_code: jsonValues.country_code,
            type: jsonValues.type,
            pricing_plan: jsonValues.pricing_plan,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (postResponse.status === 201) {
          const newEmploymentId = postResponse.data.data.employment.id;
          setEmploymentId(newEmploymentId);

          // Trigger the fetch for contract details schema
          setIsContractDetails(true);
        }
      } else {
        // Patch employment with contract details
        const patchResponse = await axios.patch(
          `${process.env.REACT_APP_GATEWAY_URL}/v1/employments/${employmentId}`,
          {
            contract_details: {
              ...jsonValues.contract_details,
            },
            pricing_plan_details: {
              frequency: jsonValues.pricing_plan,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Employment patched successfully:', patchResponse.data);
      }
    } catch (error) {
      console.error('Error during employment process:', error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <div className="App">
        <h1>Employment Information Form</h1>
        {jsonSchema ? (
          <MyFormComponent jsonSchema={jsonSchema} onSubmit={handleSubmit} isContractDetails={isContractDetails} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default App;
