import DynamicForm from "@/components/ui/form/DynamicForm.jsx";
import { Result } from "@/components/Result.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Loading } from "@/components/Loading.jsx";
import { useCredentials } from "@/domains/shared/credentials/useCredentials.js";
import { useCountries, useEstimation } from "./hooks";
import { fields, validationSchema } from "./fields";

export function CostCalculator() {
  const { credentials } = useCredentials();
  const { data: countries, isLoading } = useCountries();
  const { data: result, mutate, error, isError, isSuccess } = useEstimation();

  const handleSubmit = async (values) => {
    console.log("Form Submitted with values:", values);
    const {
      age,
      annual_gross_salary,
      employment_term,
      country,
      title,
      include_benefits,
      include_cost_breakdowns,
      regional_to_employer_exchange_rate,
    } = values;

    // Find the selected country object from the countries list
    const selectedCountry = countries.find((c) => c.name === country);

    // Extract the currency_slug and region_slug from the selected country
    const currency_slug = selectedCountry.currency.slug;
    const region_slug = selectedCountry.region_slug;

    const payload = {
      employer_currency_slug: currency_slug,
      employments: [
        {
          age,
          annual_gross_salary,
          annual_gross_salary_in_employer_currency: annual_gross_salary,
          employment_term,
          region_slug,
          regional_to_employer_exchange_rate:
            regional_to_employer_exchange_rate.toString(), // Ensure it's a string
          title,
        },
      ],
      include_benefits,
      include_cost_breakdowns,
    };

    mutate(payload);
  };

  const formFields =
    countries?.length > 0
      ? [
          {
            name: "country",
            label: "Country",
            type: "select",
            options: countries.map((c) => ({ value: c.name, label: c.name })),
            defaultValue: "",
          },
          ...fields,
        ]
      : [];

  if (!credentials) {
    return (
      <div className="text-center">
        Please fill out the credentials form to proceed.
      </div>
    );
  }

  if (isError) {
    return <p className="text-center error">{error}</p>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {formFields.length > 0 && !isSuccess && (
        <DynamicForm
          fields={formFields}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        />
      )}

      {isSuccess && (
        <div className="result-area">
          <p className="result-message">Calculation Result</p>
          <Result data={result.data} />
          <Button onClick={() => window.location.reload()}>Start Over</Button>
        </div>
      )}
    </>
  );
}
