"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { z } from "Zod"
import { useDebounce } from "@uidotdev/usehooks";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { apiResponse } from "@/types/apiResponse"
//copy paste form shadch form
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
import { Loader2 } from "lucide-react"
import Link from "next/link"



export default function SignUp() {
  const { toast } = useToast()
  const router = useRouter()
  const [username, setUsername] = useState("")
  // not need to work on setting passowrd and email the react-router-form under the hood do evety thing from setting the state to sending the values to the backend e.value.target, all the stuff
  //as using debounce in username, thats why need to do it manualy
  const [usernameAvailableMessage, setUsernameAvailableMessage] = useState("")
  const [usernameLoading, setUsernameLoading] = useState(false)
  //submit form
  const [isSubmitting, setIsSubmitting] = useState(false)
  //using debouncing on username
  const debouncedValue = useDebounce(username, 1000)

  // step1 
  // 1. Define your form.
  const definedForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  //step2: GET request on db for finding unique username
  useEffect(() => {
    //cuz this direct callback function inside the useEffect can't async
    console.log("🚩 debounce: ", debouncedValue)
    console.log("🚩 username: ", username)
    const checkUsernameUnique = async () => {
      if (debouncedValue) {               // note that empty sting is a falacy
        setUsernameLoading(true)          //make the loading appear
        setUsernameAvailableMessage("")   //clean the previous msg, if present
        try {
          const response = await axios.get(`/api/available-username?username=${debouncedValue}`)

          // console.log("⚡~sign-up/page.tsx~:response :)", response) //log axios response
          setUsernameAvailableMessage(response.data.message)
        } catch (error) {
          const AxiosError = error as AxiosError<apiResponse>
          setUsernameAvailableMessage(AxiosError.response?.data.message ?? "Error fetching Available Username")
        } finally {
          setUsernameLoading(false);
        }
      }
    }
    //run this method
    checkUsernameUnique()
  }, [debouncedValue])

  // step3
  // 2. Define a submit handler.
  const onSubmit = async (value: z.infer<typeof signUpSchema>) => {
    console.log("⚡~src/app/(auth)/sign-in/page.tsx ONSUBMIT HANDLER~ :)", value)
    // first want to activate the loading state
    setIsSubmitting(true)
    try {
      const response = await axios.post<apiResponse>("/api/sign-up", value)
      console.log("⚡~src/app/(auth)/sign-in/page.tsx AXIOS RESPONSE~ :)", response)

      //toast msg
      toast({
        title: "replace this messag with axios response after testing",
        description: response.data.message,
      })
      router.push(`/verify/${username}`)
    } catch (error) {
      console.error("Error in signup of user", error)
      const axiosError = error as AxiosError<apiResponse>
      const errorMessage = axiosError.response?.data.message
      toast({
        title: "replace this messag with axios response after testing",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl
                  >
                    {/* need to insert values inside the field */}
                    <Input placeholder="username" {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }} />
                  </FormControl>
                  {usernameLoading && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameAvailableMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                    {debouncedValue} {usernameAvailableMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={definedForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field}
                    //no need to check that is email available or not, only needed in case of username
                    />
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
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field}
                    />
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
                ) : ("signup")
              }
            </Button>
          </form>

        </Form>

        <div>
          <p>
            Already a member?{" "}
            <Link href={"/sign-in"} className="text-blue-500 hover:text-blue-800">sign-in</Link>
          </p>
        </div>
      </div>
    </div>
  </>
  )

}