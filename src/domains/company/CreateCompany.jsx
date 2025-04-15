import { useState } from "react";

import Form from "@/components/ui/form/Form.jsx";
import DynamicForm from "@/components/ui/form/DynamicForm.jsx";
import { Result } from "@/components/Result.jsx";
import { Loading } from "@/components/Loading.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { fields, validationSchema } from "./fields";
import { useCompany, useCompanyJsonSchema, useFetchCompanyManagers, useGenerateMagicLink } from "./hooks";
import { useCredentials } from "@/domains/shared/credentials/useCredentials.js";

export function CompanyCreation() {
  const [initialFormValues, setInitialFormValues] = useState();
  const { data: jsonSchema, isLoading } = useCompanyJsonSchema(
    initialFormValues?.country_code
  );
  const {
    data: responseData,
    mutate: createCompany,
    error,
    isError,
    isPending,
  } = useCompany();

  const [magicLinkError, setMagicLinkError] = useState("");
  const { mutateAsync: fetchCompanyManagers } = useFetchCompanyManagers();
  const { mutateAsync: generateMagicLink } = useGenerateMagicLink();

  async function handleInitialFormSubmit(values) {
    setInitialFormValues(values);
  }

  async function handleCompanyInformationSubmit(jsonValues) {
    // Determine the actions based on the selected checkboxes
    const actions = [];
    if (initialFormValues.get_oauth_access_tokens) {
      actions.push("get_oauth_access_tokens");
    }
    if (initialFormValues.send_create_password_email) {
      actions.push("send_create_password_email");
    }

    const actionParam =
      actions.length > 0 ? `?actions=${actions.join("%2C")}` : "";

    const payload = {
      ...initialFormValues,
      address_details: {
        ...jsonValues,
      },
      terms_of_service_accepted_at: new Date().toISOString(),
    };

    createCompany({ queryParams: actionParam, bodyParams: payload });
  }
  async function updateCredentialsWithCustomToken(customRefreshToken) {
    useCredentials.setState((state) => ({
      credentials: {
        ...state.credentials,
        refreshToken: customRefreshToken,
      },
    }));
  }
  async function handleGoToRemote() {
    try {
      const customRefreshToken = responseData.data.tokens.refresh_token;
      console.log("Custom Refresh Token:", customRefreshToken);
  
      // Step 1: Update global credentials with the custom token
      updateCredentialsWithCustomToken(customRefreshToken);
  
      // Step 2: Fetch company managers
      const managers = await fetchCompanyManagers();
      const owner = managers.find((manager) => manager.role === "owner");
  
      if (!owner) {
        throw new Error("Owner not found in company managers.");
      }
  
      const userId = owner.user_id;
  
      // Step 3: Generate magic link
      const magicLinkUrl = await generateMagicLink({ userId });
      window.open(magicLinkUrl, "_blank");
    } catch (error) {
      console.error("Error generating magic link:", error);
    }
  }
  

  if (isLoading || isPending) {
    return <Loading />;
  }

  if (isError) {
    return <p className="error">Error creating a company: {error.message}</p>;
  }

  return (
    <>
      {!initialFormValues ? (
        <DynamicForm
          fields={fields}
          validationSchema={validationSchema}
          onSubmit={handleInitialFormSubmit}
        />
      ) : (
        <>
          {responseData ? (
            <div className="result-area">
              <p className="result-message">Company created successfully ✓</p>
              <Result data={responseData} />
              <Button onClick={() => window.location.reload()}>
                Start Over
              </Button>
              <Button
                onClick={handleGoToRemote}
                disabled={!responseData || !responseData.data.tokens.refresh_token}
              >
                Go to Remote
              </Button>
              {magicLinkError && <p className="error">{magicLinkError}</p>}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="h2">Company Information Form</h2>
              {jsonSchema && (
                <Form
                  jsonSchema={jsonSchema}
                  onSubmit={handleCompanyInformationSubmit}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
