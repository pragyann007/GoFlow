import { z } from "zod";
import { IFNodeProperty } from "@/types/workflow";

import { shoudShowField } from "@/app/utils/displayOptions"; // Ensure path is correct

export function generateDynamicSchema(properties: IFNodeProperty[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  if (!Array.isArray(properties)) {
    return z.object(shape);
  }

  for (const prop of properties) {
    let validator: z.ZodTypeAny;

    switch (prop.type) {
      case "string":
        // Base string validator
        validator = z.string();
        break;
      case "number":
        validator = z.coerce.number();
        break; 
      case "boolean":
        validator = z.boolean();
        break;
      case "options":
        validator =
          prop.options && prop.options.length > 0
            ? z.enum(prop.options as [string, ...string[]])
            : z.string();
        break;
      default:
        validator = z.any();
    }

    if (prop.default !== undefined) {
      validator = validator.default(prop.default);
    }

    shape[prop.name] = validator;
  }

  // Use superRefine to check displayOptions conditionally at validation/submission time
  return z.object(shape).superRefine((data, ctx) => {
    for (const prop of properties) {
      const displayOpts = prop.displayOptions;

      // If the property has displayOptions rules, check if it's currently "visible"
      if (displayOpts?.show) {
        let isVisible = true;

        for (const [dependentField, allowedValues] of Object.entries(displayOpts.show)) {
          const currentValue = data[dependentField];
          if (!allowedValues.includes(currentValue)) {
            isVisible = false;
            break;
          }
        }

        // If it IS visible, enforce that it's not empty (for string types)
        if (isVisible && prop.type === "string") {
          const val = data[prop.name];
          if (!val || (typeof val === "string" && val.trim() === "")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [prop.name],
              message: "This field is required",
            });
          }
        }
      } else {
        // For always-visible fields (like URL or Method), enforce regular required rules if they are strings
        if (prop.type === "string") {
          const val = data[prop.name];
          if (!val || (typeof val === "string" && val.trim() === "")) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [prop.name],
              message: "This field is required",
            });
          }
        }
      }
    }
  });
}

export function generateDefaultValue(properties: IFNodeProperty[]) {
  const defaults: Record<string, any> = {};
  if (!Array.isArray(properties)) {
    return defaults
  }

  for (const prop of properties) {
    defaults[prop.name] =
      prop.default ??
      (prop.type === "boolean"
        ? false
        : prop.type === "number"
        ? 0
        : prop.type === "options"
        ? prop.options?.[0] ?? ""
        : "");
  }

  return defaults;
}