import Form from "@/components/ui/form/Form";
import { Link, useSearchParams } from "react-router-dom";

import {
  addressDetailsSchema,
  employmentBasicInformationSchema,
  contractDetailsSchema,
} from "./schemas";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Result } from "@/components/Result";

const queryToSchema = {
  "contract-details": contractDetailsSchema,
  "employment-basic-information": employmentBasicInformationSchema,
  "address-details": addressDetailsSchema,
};

function getSchemaFromQueryParam(schemaParam) {
  return Object.keys(queryToSchema).includes(schemaParam)
    ? schemaParam
    : "contract-details";
}

export function JSONSchemaPlayground() {
  const [result, setResult] = useState();
  const [searchParams] = useSearchParams();
  const schemaParam = getSchemaFromQueryParam(searchParams.get("schema"));
  const schema = queryToSchema[schemaParam] || contractDetailsSchema;

  useEffect(() => {
    if (result) {
      setResult(null);
    }
  }, [schemaParam]);

  return (
    <div className="flex">
      <div className="grow-0 basis-1/4">
        <h3 className="h3">JSON Schemas</h3>
        <ul>
          <li
            className={cn(
              "text-sm mb-2",
              schemaParam === "contract-details" ? "text-primary" : ""
            )}
          >
            <Link to="/playground?schema=contract-details">
              Contract Details
            </Link>
          </li>
          <li
            className={cn(
              "text-sm mb-2",
              schemaParam === "employment-basic-information"
                ? "text-primary"
                : ""
            )}
          >
            <Link to="/playground?schema=employment-basic-information">
              Employment Basic Information
            </Link>
          </li>
          <li
            className={cn(
              "text-sm mb-2",
              schemaParam === "address-details" ? "text-primary" : ""
            )}
          >
            <Link to="/playground?schema=address-details">Address Details</Link>
          </li>
        </ul>
        <div className="text-xs p-2 mt-8 border border-input rounded-lg">
          <span className="font-bold">Disclaimer:</span> These are static JSON
          Schemas and may be outdated. This page is intended solely to help
          understand how forms are rendered based on JSON Schemas and the
          generated payload.
        </div>
      </div>
      <div className="grow basis-2/4 flex flex-col items-center">
        <Form
          key={schemaParam}
          className="m-0"
          jsonSchema={schema}
          onSubmit={(values) => {
            setResult(values);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
      <div className="grow-0 basis-2/4 max-w-md overflow-x-auto">
        {result && <Result data={result} />}
      </div>
    </div>
  );
}
