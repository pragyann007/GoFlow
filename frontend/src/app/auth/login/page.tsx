"use client"
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { zodResolver } from "@hookform/resolvers/zod"
import React from 'react'
import * as z from "zod"
import { useForm, Controller } from "react-hook-form"
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogin } from '@/hooks/useAuth'

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }), // Fixed for Zod compatibility
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
})

const Page = () => { // Capitalized component name for Next.js convention


    const {mutate:login,isPending,error} = useLogin()


    const router = useRouter()
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("value is ", values)
        console.log("hii ")
login(values)


    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    return (
        <div className='min-w-100 flex justify-center'>
            <Card className='p-6 w-full max-w-md'>
                <CardTitle className='text-center mb-6'>
                    Login to GoFlow
                </CardTitle>

                <CardContent>
                   {/* Fixed: Removed the arrow function wrapper around form.handleSubmit */}
                   <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                       <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="email"
                                        placeholder='xyz@gmail.com'
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        placeholder='************'
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button  disabled={isPending} type='submit'>
                            {isPending?"Logging in...":"Login"}
                        </Button>
                   </form>
                </CardContent>

                <CardFooter className='flex justify-center items-center mt-4'>
                    <small className='flex gap-2'>
                        Don't have an account?  
                        <span className='underline'>
                            <Link href={"/auth/register"}>Register</Link>
                        </span> 
                    </small>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page