import { useMemo } from "react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/Button.jsx";

const DynamicForm = ({ fields, validationSchema, onSubmit }) => {
  const initialValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});
  }, [fields]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Cast values based on field types before submitting
      const castedValues = fields.reduce((acc, field) => {
        switch (field.type) {
          case "number":
            acc[field.name] = parseFloat(values[field.name]);
            break;
          case "integer":
            acc[field.name] = parseInt(values[field.name], 10);
            break;
          case "boolean":
          case "checkbox":
            acc[field.name] =
              values[field.name] === "true" || values[field.name] === true;
            break;
          default:
            acc[field.name] = values[field.name];
        }
        return acc;
      }, {});

      onSubmit(castedValues);
    },
  });

  return (
    <div className="form-area">
      <form className="form" onSubmit={formik.handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label className="label">
              {field.label}
              {field.type === "checkbox" && (
                <input
                  className="ml-2"
                  type={field.type}
                  name={field.name}
                  onChange={formik.handleChange}
                  value={formik.values[field.name]}
                />
              )}
            </label>

            {field.type !== "checkbox" && (
              <>
                {field.type === "select" ? (
                  <select
                    className="select"
                    name={field.name}
                    onChange={(event) => {
                      formik.handleChange(event);
                      if (field.onChange) field.onChange(event);
                    }}
                    value={formik.values[field.name]}
                  >
                    <option value="" disabled>
                      Select {field.label}
                    </option>
                    {field.options &&
                      field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    className="input"
                    type={field.type}
                    name={field.name}
                    onChange={formik.handleChange}
                    value={formik.values[field.name]}
                  />
                )}
              </>
            )}
            {formik.errors[field.name] && formik.touched[field.name] ? (
              <p className="error">{formik.errors[field.name]}</p>
            ) : null}
          </div>
        ))}
        <Button type="submit" variant="default">
          Submit
        </Button>
      </form>
    </div>
  );
};

DynamicForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.string.isRequired,
      defaultValue: PropTypes.any,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      onChange: PropTypes.func, // Add onChange prop to handle specific field change
    })
  ).isRequired,
  validationSchema: PropTypes.object.isRequired, // Validation schema typically provided by Yup
  onSubmit: PropTypes.func.isRequired,
};

export default DynamicForm;
