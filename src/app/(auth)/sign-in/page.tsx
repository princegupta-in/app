"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "Zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignUp() {
    const { toast } = useToast()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 1. Define your form.
    const definedForm = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        //next auth is handling sign-in
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if (!result) {
            toast({
                title: "Login failed",
                description: "Invalid Username/Password",
                variant: "destructive"
            })
            setIsSubmitting(false)
        } else {
            toast({
                title: "Signup Successfull!",
                description: "created with ❤️ by PrinceGupta",
            })
            setIsSubmitting(false)
        }
        if (result?.url) {
            router.push("/dashboard")
        }
    }

    return (<>
        <div className="flex min-h-screen items-center justify-center bg-purple-300">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-purple-200 p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">join random message</h1>
                    <p className="mb-4">sign up to start your anonymous adventure</p>
                </div>
                <Form {...definedForm}>
                    <form onSubmit={definedForm.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={definedForm.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email/Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={definedForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : ("Signin")
                            }
                        </Button>
                    </form>
                </Form>

                <div>
                    <p>
                        Not a member yet?{" "}
                        <Link href={"/sign-in"} className="text-blue-500 hover:text-blue-800">Sign-up</Link>
                    </p>
                </div>
            </div>
        </div>
    </>
    )

}