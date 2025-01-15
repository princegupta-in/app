"use client"
import { useToast } from "@/hooks/use-toast";
import { otpVerifySchema } from "@/schemas/otpVerifySchema";
import { apiResponse } from "@/types/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "Zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


export default function verify() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast()


    // 1. Define your form.
    const definedForm = useForm<z.infer<typeof otpVerifySchema>>({
        resolver: zodResolver(otpVerifySchema),
    })

    // 2. what to do on click submit
    const onSubmit = async (data: z.infer<typeof otpVerifySchema>) => {

        try {
            const response = await axios.post("/api/otp-verification", {
                username: params.username,
                otp: data.otp
            })
            toast({
                title: "Success",
                description: response.data.message
            })
            router.push("/sign-in")
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<apiResponse>
            const errorMessage = axiosError.response?.data.message
            toast({
                title: "replace this messag with axios response after testing",
                description: errorMessage,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-purple-300">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-purple-200 p-8 shadow-md">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-center">Verify your Account</h1>
                    <p className="mb-4 text-center">Enter the verification code sent to your email</p>
                    <Form {...definedForm}>
                        <form onSubmit={definedForm.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={definedForm.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-light">verification code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="otp" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div >
    )

}