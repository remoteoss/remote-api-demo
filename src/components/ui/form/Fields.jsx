import PropTypes from "prop-types";

import {
  Field as FormikField,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Dialog from "@radix-ui/react-dialog";

// Helper component to render descriptions with support for help center dialogs
const Description = ({ description, helpCenter }) => {
  const { callToAction, title, content, error } = helpCenter || {};

  return (
    <p className="text-xs text-secondary my-1">
      {description && typeof description === "string" ? (
        <span dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <>{description}</>
      )}
      {callToAction && (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="DialogTrigger">{callToAction}.</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="DialogOverlay" />
            <Dialog.Content className="DialogContent">
              <Dialog.Title className="DialogTitle">{title}</Dialog.Title>
              <div dangerouslySetInnerHTML={{ __html: content || error }}></div>
              <br />
              <Dialog.Close asChild>
                <button>Close</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </p>
  );
};

Description.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  helpCenter: PropTypes.shape({
    callToAction: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    error: PropTypes.string,
  }),
};

// Field component for text input
function FieldText({ type, name, label, description, meta }) {
  return (
    <div key={name}>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <FormikField type={type} name={name} id={name} className="input" />
      <Description description={description} helpCenter={meta?.helpCenter} />
      <p className="error">
        <FormikErrorMessage name={name}>
          {(msg) => meta?.["x-jsf-errorMessage"] || msg}
        </FormikErrorMessage>
      </p>
    </div>
  );
}

FieldText.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.object,
};

// Field component for checkbox input
function FieldCheckbox({ type, name, label, description, meta }) {
  return (
    <div key={name}>
      <div className="flex">
        <FormikField type={type} name={name} id={name} />
        <label className="label" htmlFor={name}>
          {label}
        </label>
      </div>
      <div>
        <Description description={description} helpCenter={meta?.helpCenter} />
        <p className="error">
          <FormikErrorMessage name={name}>
            {(msg) => meta?.["x-jsf-errorMessage"] || msg}
          </FormikErrorMessage>
        </p>
      </div>
    </div>
  );
}

FieldCheckbox.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.object,
};

// Field component for textarea input
function FieldTextarea({ name, label, description, meta }) {
  return (
    <div key={name}>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <FormikField as="textarea" name={name} id={name} className="textarea" />
      <Description description={description} helpCenter={meta?.helpCenter} />
      <p className="error">
        <FormikErrorMessage name={name}>
          {(msg) => meta?.["x-jsf-errorMessage"] || msg}
        </FormikErrorMessage>
      </p>
    </div>
  );
}

FieldTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.object,
};

function FieldSelect({ name, label, description, options, meta }) {
  return (
    <div key={name}>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <FormikField
        as="select"
        name={name}
        id={name}
        placeholder="select..."
        className="select"
      >
        <option disabled value="">
          Select...
        </option>
        {options.map((opt) => (
          <option value={opt.value} key={opt.value}>
            {opt.label}{" "}
          </option>
        ))}
      </FormikField>
      <Description description={description} helpCenter={meta?.helpCenter} />
      <p className="error">
        <FormikErrorMessage name={name}>
          {(msg) => meta?.["x-jsf-errorMessage"] || msg}
        </FormikErrorMessage>
      </p>
    </div>
  );
}

FieldSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  meta: PropTypes.object,
};

// Field component for radio buttons
function FieldRadio({ name, label, description, options, meta }) {
  return (
    <fieldset key={name}>
      <label className="label">{label}</label>
      <Description description={description} helpCenter={meta?.helpCenter} />
      {options.map((opt) => (
        <span key={opt.value}>
          <label className="text-sm flex mr-4 mb-2">
            <FormikField
              className="mr-1"
              type="radio"
              name={name}
              value={opt.value}
            />
            {opt.label}
          </label>
          <p className="text-secondary text-xs mb-2 ml-5">{opt.description}</p>
        </span>
      ))}
      <p className="error">
        <FormikErrorMessage name={name}>
          {(msg) => meta?.["x-jsf-errorMessage"] || msg}
        </FormikErrorMessage>
      </p>
    </fieldset>
  );
}

FieldRadio.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  meta: PropTypes.object,
};

// Field component for email input
function FieldEmail({ name, label, description, meta }) {
  return (
    <div key={name}>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <FormikField className="input" type="email" name={name} id={name} />
      <Description description={description} helpCenter={meta?.helpCenter} />
      <p className="error">
        <FormikErrorMessage name={name}>
          {(msg) => meta?.["x-jsf-errorMessage"] || msg}
        </FormikErrorMessage>
      </p>
    </div>
  );
}

FieldEmail.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  meta: PropTypes.object,
};

// Field component for hidden fields within a fieldset
function FieldsetHidden({ name, label, description, fields }) {
  if (!fields || fields.length === 0) {
    return null; // Return null if fields are not provided or empty
  }

  return (
    <fieldset className="fieldset" key={name}>
      <legend>{label}</legend>
      {description && <p>{description}</p>}

      {fields.map((field) => {
        if (field.isVisible === false || field.deprecated) {
          return null;
        }

        if (field.type === "hidden") {
          return (
            <FormikField key={field.name} type="hidden" name={field.name} />
          );
        }

        return null;
      })}
    </fieldset>
  );
}

FieldsetHidden.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      isVisible: PropTypes.bool,
      deprecated: PropTypes.bool,
      type: PropTypes.string,
    })
  ),
};

// General fieldset component
function Fieldset({ name, label, description, fields }) {
  return (
    <fieldset className="fieldset">
      <legend>{label}</legend>
      <Description description={description} />

      {fields.map((field) => {
        if (field.isVisible === false) {
          return null;
        }

        const FieldComponent = fieldsMapConfig[field.type];
        return FieldComponent ? (
          <FieldComponent
            key={field.name}
            {...field}
            name={`${name}.${field.name}`}
          />
        ) : (
          <p className="error">Field type {field.type} not supported</p>
        );
      })}
    </fieldset>
  );
}

Fieldset.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      isVisible: PropTypes.bool,
      deprecated: PropTypes.bool,
      type: PropTypes.string,
    })
  ),
};

// Mapping of field types to their respective components
export const fieldsMapConfig = {
  text: FieldText,
  date: FieldText,
  textarea: FieldTextarea,
  select: FieldSelect,
  radio: FieldRadio,
  checkbox: FieldCheckbox,
  email: FieldEmail,
  hidden: FieldsetHidden,
  number: (props) => <FieldText {...props} type="text" />,
  money: (props) => <FieldText {...props} type="text" />,
  fieldset: Fieldset,
  countries: FieldSelect,
};
