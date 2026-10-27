"use client"
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { IFNodeProperty } from '@/types/workflow'
import React, { useMemo } from 'react'
import * as z from "zod"
import { useForm, Controller } from "react-hook-form"
import { generateDefaultValue, generateDynamicSchema } from '@/app/utils/node.zod.utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NodeConfigFormProps {
    fields: IFNodeProperty[];
    onSubmit: (values: any) => void;
}

const NodeConfigForm = ({ fields, onSubmit }: NodeConfigFormProps) => {
  // 1. Generate dynamic schema & default values using your utils
  const schema = useMemo(() => generateDynamicSchema(fields), [fields])
  const defaultValues = useMemo(() => generateDefaultValue(fields), [fields])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  })
  
  const formValues = form.watch()

  // 2. Conditional display logic (e.g. showing body only when method is POST)
  const shouldDisplay = (prop: IFNodeProperty) => {
    if (!prop.displayOptions?.show) return true;

    return Object.entries(prop.displayOptions.show).every(([fieldName, allowedValues]) => {
      return allowedValues.includes(formValues[fieldName])
    })
  }

  return (
    <div className='flex justify-center w-full'>
      <Card className='p-6 w-full max-w-xl'>
        <CardTitle className='text-center mb-6'>
          Node Configuration
        </CardTitle>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {fields.map((field) => {
              // Skip rendering if conditional rules are not met
              if (!shouldDisplay(field)) return null;

              return (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={form.control}
                  render={({ field: rhfField, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={rhfField.name}>{field.displayName}</FieldLabel>
                      
                      {/* Render input UI based on property type */}
                      {field.type === 'options' ? (
                        <select
                          {...rhfField}
                          id={rhfField.name}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Select {field.displayName}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'boolean' ? (
                        <input
                          type="checkbox"
                          checked={rhfField.value}
                          onChange={rhfField.onChange}
                          id={rhfField.name}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      ) : (
                        <Input
                          {...rhfField}
                          id={rhfField.name}
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder ?? `Enter ${field.displayName}`}
                          aria-invalid={fieldState.invalid}
                          value={rhfField.value as string | number | undefined}
                        />
                      )}

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              );
            })} 

            <Button type='submit'>
              Save Configuration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NodeConfigForm