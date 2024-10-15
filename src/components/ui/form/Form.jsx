import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { modify, createHeadlessForm } from "@remoteoss/json-schema-form";
import { Formik, Form as FormikForm } from "formik";
import { fieldsMapConfig } from "@/components/ui/form/Fields.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { cn } from "@/lib/utils";

const COMPONENT_KEY = "Component";

// Function to check if a field has a forced value
function hasForcedValue(field) {
  return (
    field.const !== undefined && field.const === field.default && !field.options
  );
}

// Function to get initial values for the form fields
function getPrefilledValues(fields, initialValues) {
  return fields.reduce((acc, field) => {
    const initialValue = initialValues[field.name];
    if (field.inputType === "fieldset") {
      return {
        ...acc,
        [field.name]: getPrefilledValues(field.fields, initialValue),
      };
    }
    return { ...acc, [field.name]: initialValue || "" };
  }, {});
}

function formValuesToJsonValues(values, fields) {
  const fieldValueTransform = {
    text: (val) => val,
    number: (val) => (val === "" ? val : parseFloat(val)),
    money: (val) => (val === "" ? null : val * 100),
    integer: (val) => (val === "" ? null : parseInt(val)),
    boolean: (val) => val === "true" || val === true,
    email: (val) => val,
    textarea: (val) => val,
    select: (val) => val,
    radio: (val) => val,
    checkbox: (val, fieldsetFields, fieldProps) => {
      // Ensure field is defined and has a const property
      if (fieldProps && typeof fieldProps === "object") {
        if (typeof val === "boolean") {
          return val ? fieldProps.const : null;
        }
      }
      // Fallback for unexpected cases
      return val === "" ? null : val;
    },
    date: (val) => val,
    fieldset: (val, fieldsetFields) => {
      if (typeof val !== "object" || val === null) return null;

      const fieldsetValues = {};
      Object.keys(val).forEach((key) => {
        const subField = fieldsetFields.find((f) => f.name === key);
        if (subField) {
          const subFieldValue = fieldValueTransform[subField.inputType]?.(
            val[key],
            subField
          );
          if (
            subFieldValue !== "" &&
            subFieldValue !== null &&
            subFieldValue !== undefined
          ) {
            fieldsetValues[key] = subFieldValue;
          }
        }
      });

      return Object.keys(fieldsetValues).length > 0 ? fieldsetValues : null;
    },
  };

  const jsonValues = {};

  fields.forEach(
    ({ name, inputType, fields: fieldsetFields, ...fieldProps }) => {
      const formValue = values[name];
      const transformedValue = fieldValueTransform[inputType]?.(
        formValue,
        fieldsetFields,
        fieldProps
      );
      const valueToUse =
        transformedValue === null || transformedValue !== undefined
          ? transformedValue
          : formValue;

      if (
        valueToUse !== "" &&
        valueToUse !== null &&
        valueToUse !== undefined
      ) {
        jsonValues[name] = valueToUse;
      }
    }
  );

  return jsonValues;
}

export default function Form({ jsonSchema, onSubmit, className }) {
  const [modifiedSchema, setModifiedSchema] = useState(null);

  useEffect(() => {
    // Modify the schema as needed
    const { schema: modified, warnings } = modify(jsonSchema, {
      fields: {
        // Add any custom modifications here if necessary
      },
    });

    setModifiedSchema(modified);

    if (warnings && warnings.length) {
      console.warn("Schema modification warnings:", warnings);
    }
  }, [jsonSchema]);

  if (!modifiedSchema) {
    return null;
  }

  const API_STORED_VALUES = {}; // Set this with any stored values if available

  const { fields, handleValidation, error } = createHeadlessForm(
    modifiedSchema,
    {
      initialValues: API_STORED_VALUES,
    }
  );

  const initialValues = getPrefilledValues(fields, API_STORED_VALUES);

  function handleValidate(formValues) {
    const jsonValues = formValuesToJsonValues(formValues, fields);
    const { formErrors } = handleValidation(jsonValues);
    return formErrors; // Returned errors will be used by Formik
  }

  function handleFormSubmit(formValues) {
    console.log("Form values before casting:", formValues);
    const jsonValues = formValuesToJsonValues(formValues, fields);
    console.log("Form values after casting:", jsonValues);
    onSubmit(jsonValues);
  }

  return (
    <Formik
      initialValues={initialValues}
      validate={handleValidate}
      onSubmit={handleFormSubmit}
    >
      {({ isSubmitting, errors }) => (
        <div className={cn("form-area", className)}>
          <FormikForm className="form">
            {fields.map((field) => {
              if (field.isVisible === false || field.deprecated) {
                return null; // Skip hidden or deprecated fields
              }

              if (hasForcedValue(field)) {
                // Skip fields with forced values or implement custom logic
                return null; // Customize or omit this based on your needs
              }

              const FieldComponent =
                field[COMPONENT_KEY] || fieldsMapConfig[field.inputType];

              return FieldComponent ? (
                <FieldComponent key={field.name} {...field} />
              ) : (
                <p className="error">
                  Field type {field.inputType} not supported
                </p>
              );
            })}

            <Button type="submit">Submit</Button>
          </FormikForm>
        </div>
      )}
    </Formik>
  );
}

Form.propTypes = {
  jsonSchema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};
