import { useState } from "react";

import Form from "@/components/ui/form/Form.jsx";
import DynamicForm from "@/components/ui/form/DynamicForm.jsx";
import { Loading } from "@/components/Loading.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { fields, validationSchema } from "./fields";
import {
  useCreateEmployment,
  useEmploymentInvite,
  useJsonSchema,
  useUpdateEmployment,
} from "./hooks";
import { Result } from "@/components/Result";

export function EmploymentCreation() {
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [employmentId, setEmploymentId] = useState();
  // Fetches the JSON schema for the employment form
  const {
    data: jsonSchema,
    isLoading,
    isError,
    error,
  } = useJsonSchema(initialFormValues?.country_code, employmentId);
  // Sends an employment invite
  const { mutate: employmentInviteMutation } = useEmploymentInvite(
    employmentId,
    {
      onSuccess: () => {
        setSubmissionStatus(
          "Contract details and pricing plan submitted successfully, invite sent successfully ✓"
        );
      },
    }
  );
  // Creates an employment
  const { mutate: employmentCreateMutation } = useCreateEmployment({
    onSuccess: ({ data }) => {
      setEmploymentId(data.employment.id);
    },
  });
  // Updates an employment
  const { mutate: employmentUpdateMutation, data: responseData } =
    useUpdateEmployment(employmentId, {
      onSuccess: async () => {
        if (initialFormValues.send_self_enrollment_invitation) {
          employmentInviteMutation();
        } else {
          setSubmissionStatus(
            "Contract details and pricing plan submitted successfully, invite was not sent as requested ✓"
          );
        }
      },
    });

  // Submit the initial form
  async function handleInitialFormSubmit(values) {
    setInitialFormValues(values);
  }

  // Submit the employment form
  async function handleSubmit(values) {
    if (!employmentId) {
      employmentCreateMutation({
        bodyParams: {
          basic_information: values,
          country_code: initialFormValues.country_code,
          type: initialFormValues.type,
        },
      });
    } else {
      employmentUpdateMutation({
        bodyParams: {
          contract_details: values,
          pricing_plan_details: {
            frequency: initialFormValues.pricing_plan,
          },
        },
      });
    }
  }

  const handleStartOver = () => {
    setEmploymentId(null);
    setInitialFormValues(null);
    setSubmissionStatus(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <p className="error">{error}</p>;
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
          {submissionStatus ? (
            <div className="result-area">
              <p className="result-message">{submissionStatus}</p>
              {responseData && <Result data={responseData} />}
              <Button onClick={handleStartOver}>Start Over</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="h2">Employment Information Form</h2>
              {jsonSchema && (
                <Form jsonSchema={jsonSchema} onSubmit={handleSubmit} />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
