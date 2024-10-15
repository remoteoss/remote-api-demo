import { useFormik } from "formik";
import { object, string } from "yup";

import lock from "@/assets/lock.svg";
import { Button } from "@/components/ui/Button.jsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet.jsx";
import { useCredentials } from "@/domains/shared/credentials/useCredentials.js";

const validationSchema = object({
  clientId: string().required("Client ID is required"),
  clientSecret: string().required("Client Secret is required"),
  refreshToken: string().required("Refresh Token is required"),
  gatewayUrl: string().url("Invalid URL").required("Gateway URL is required"),
});

export function CredentialsForm() {
  const { credentials, setCredentials } = useCredentials();

  const formik = useFormik({
    initialValues: {
      clientId: credentials.clientId,
      clientSecret: credentials.clientSecret,
      refreshToken: credentials.refreshToken,
      gatewayUrl: credentials.gatewayUrl,
    },
    validationSchema,
    onSubmit: (values) => {
      // Save form data to localStorage
      localStorage.setItem("credsFormData", JSON.stringify(values));
      setCredentials(values);
    },
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <img src={lock} alt="home" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Insert credentials</SheetTitle>
          <SheetDescription>
            If you don't know where to find these credentials, please refer to
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 pb-0">
          <div className="form-area" style={{ margin: 0, padding: 0 }}>
            <form onSubmit={formik.handleSubmit} className="form">
              <div>
                <label className="label" htmlFor="clientId">
                  Client ID
                </label>
                <input
                  className="input"
                  id="clientId"
                  name="clientId"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.clientId}
                />
                {formik.touched.clientId && formik.errors.clientId ? (
                  <p className="error">{formik.errors.clientId}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="clientSecret">
                  Client Secret
                </label>
                <input
                  className="input"
                  id="clientSecret"
                  name="clientSecret"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.clientSecret}
                />
                {formik.touched.clientSecret && formik.errors.clientSecret ? (
                  <p className="error">{formik.errors.clientSecret}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="refreshToken">
                  Refresh Token
                </label>
                <input
                  className="input"
                  id="refreshToken"
                  name="refreshToken"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.refreshToken}
                />
                {formik.touched.refreshToken && formik.errors.refreshToken ? (
                  <p className="error">{formik.errors.refreshToken}</p>
                ) : null}
              </div>
              <div>
                <label className="label" htmlFor="gatewayUrl">
                  Gateway URL
                </label>
                <input
                  className="input"
                  id="gatewayUrl"
                  name="gatewayUrl"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.gatewayUrl}
                />
                {formik.touched.gatewayUrl && formik.errors.gatewayUrl ? (
                  <p className="error">{formik.errors.gatewayUrl}</p>
                ) : null}
              </div>
              <SheetClose asChild>
                <Button type="submit">Save</Button>
              </SheetClose>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
