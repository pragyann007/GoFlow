import React from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Save } from "lucide-react";
import { IFNodeProperty } from "@/types/workflow";
import { generateDefaultValue, generateDynamicSchema } from "@/app/utils/node.zod.utils";
import { shoudShowField } from "@/app/utils/displayOptions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface NodeConfigFormProps {
  properties: IFNodeProperty[];
  onSubmit?: (data: any) => void;
}

const NodeConfigForm: React.FC<NodeConfigFormProps> = ({ properties = [], onSubmit }) => {
  // 1. Generate dynamic schema & default values
  console.log("Propertis",properties)

  const safeProperties = Array.isArray(properties) ? properties : [];

  // Update these to use the safe version:
  const schema = generateDynamicSchema(safeProperties);
  const defaultValues = generateDefaultValue(safeProperties);


  // 2. Initialize React Hook Form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  // 3. Watch all form fields for dynamic conditional rendering (displayOptions)
  const watchedValues = useWatch({ control });

  const handleFormSubmit = (data: any) => {
    alert("hii")
    console.log("Submitted Node Config:",data);
    if (onSubmit) onSubmit(data);
  };

  const inputClass =
    "h-10 bg-muted/40 border-border shadow-none transition-all duration-200 " +
    "placeholder:text-muted-foreground/60 hover:border-primary/40 " +
    "focus-visible:bg-background focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex w-full flex-col gap-5 p-5 text-left"
    >
      {safeProperties.map((prop) => {
        // Check conditional rendering
        if (!shoudShowField(prop, watchedValues)) {
          return null;
        }

        const errorMessage = errors[prop.name]?.message as string | undefined;
        const hasError = !!errorMessage;

        return (
          <div
            key={prop.name}
            className={cn(
              "flex flex-col gap-2",
              prop.type === "boolean" &&
                "rounded-lg border bg-muted/40 p-3 transition-colors hover:border-primary/40"
            )}
          >
            {/* Boolean sits inline: label left, switch right */}
            {prop.type === "boolean" ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={prop.name} className="text-sm font-medium">
                    {prop.displayName}
                  </Label>
                  <span className="text-xs text-muted-foreground">Enable</span>
                </div>
                <Controller
                  name={prop.name}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id={prop.name}
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            ) : (
              <Label htmlFor={prop.name} className="text-sm font-medium">
                {prop.displayName}
              </Label>
            )}

            {/* Field Type: String */}
            {prop.type === "string" && (
              <Input
                id={prop.name}
                {...register(prop.name)}
                placeholder={prop.placeholder ?? ""}
                aria-invalid={hasError}
                className={cn(inputClass, hasError && "border-destructive focus-visible:ring-destructive/20")}
              />
            )}

            {/* Field Type: Number */}
            {prop.type === "number" && (
              <Input
                id={prop.name}
                type="number"
                {...register(prop.name)}
                placeholder={prop.placeholder ?? ""}
                aria-invalid={hasError}
                className={cn(inputClass, hasError && "border-destructive focus-visible:ring-destructive/20")}
              />
            )}

            {/* Field Type: Options / Select */}
            {prop.type === "options" && (
              <Controller
                name={prop.name}
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={prop.name}
                      className={cn(
                        "h-10 w-full bg-muted/40 shadow-none transition-all duration-200 hover:border-primary/40",
                        "focus:border-primary focus:ring-4 focus:ring-primary/15",
                        hasError && "border-destructive"
                      )}
                    >
                      <SelectValue placeholder={prop.placeholder ?? "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {prop.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}

            {/* Validation Error Message */}
            {errorMessage && (
              <p className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="size-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>
        );
      })}

      <Separator className="my-1" />

      <Button
        type="submit"
        className="h-10 w-full gap-2 font-semibold shadow-md transition-all duration-200 hover:-translate-y-px hover:shadow-lg active:translate-y-0"
      >
        <Save className="size-4" />
        Save configuration
      </Button>
    </form>
  );
};

export default NodeConfigForm;