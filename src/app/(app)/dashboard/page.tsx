"use client"

import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { apiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCw } from "lucide-react"
import MessageCard from "@/components/MessageCard"


export default function Dashboard() {
    const [copiedText, copyToClipboard] = useCopyToClipboard();

    const [messages, setMessages] = useState<Message[]>([])
    const [isLoadingMessage, setIsLoadingMessage] = useState(false)
    const [isSwitchLoading, setIsSwitchLoadinge] = useState(false)
    const { toast } = useToast()

    //here will use optimistic UI approach to handel delete message, means if a user clicks on X, will update the UI instantly, and then handel the backend after that

    // const handleDeleteMessage(messageId:string){
    //     const filteredMessageArray = message.filter(e=>(e._id !==messageId))
    //     // setMessage(())
    // }
    const handleDeleteMessage = (messageId: string) => {
        //@ts-ignore
        setMessages(messages.filter((e) => e._id! !== messageId))
    }


    const { data: session, status } = useSession()

    //using useForm hook from react-hook-form
    const definedForm = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = definedForm

    const acceptMessage = watch("acceptMessage")//subscribing to acceptMessage only

    //big funcion 1
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoadinge(true)
        try {
            const response = await axios.get<apiResponse>("/api/toggle-accept-message")
            setValue("acceptMessage", response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsSwitchLoadinge(false)
        }

    }, [setValue])

    //big function 2
    // refresh is parameter, type is boolean and default value is false
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoadingMessage(true)
        setIsSwitchLoadinge(false)
        try {
            const response = await axios.get<apiResponse>("/api/get-message-list")
            setMessages(response.data.messages || [])

            if (refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing Latest Messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        } finally {
            setIsLoadingMessage(true)
            setIsSwitchLoadinge(false)
        }
    }, [setIsLoadingMessage, setMessages])

    useEffect(() => {
        if (!session || !session.user) {
            return
        }
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    //handel switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<apiResponse>("/api/toggle-accept-message", {
                acceptMessagesBooleanFlag: !acceptMessage
            })
            setValue("acceptMessage", !acceptMessage) //will change value in UI
            toast({
                title: response.data.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                variant: "destructive"
            })
        }
    }

    if (!session || !session.user) {
        return <div>please login first</div>
    }

    //logic for making the url for sharing
    const baseUrl = window.location.origin
    const profileUrl = `${baseUrl}/u/${session.user.username}`


    return (
        <>
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
                <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">copy your unique link</h2>
                    <div className="flex items-center">
                        <Input
                            type="text"
                            value={profileUrl}
                            disabled />
                        <Button onClick={() => { useCopyToClipboard }} />
                    </div>
                </div>

                <Switch
                    {...register("acceptMessage")}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages:{acceptMessage ? "On" : "Off"}
                </span>
            </div>

            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoadingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            //@ts-ignore
                            key={message._id}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </>
    )
}