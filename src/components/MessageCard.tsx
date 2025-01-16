import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { apiResponse } from "@/types/apiResponse"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"


// type MessageCardProps = {
//     message: Message,
//     onMessageDelete: (messageId: string) => void
// }


//need to give this props(parent component dega) to this function
export default function MessageCard({ message, onMessageDelete }: any) {

    const { toast } = useToast()

    async function handelDeleteConfirm() {
        const response = axios.delete<apiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: "response.data.message",
        })
        onMessageDelete(message._id)//get the detail of this line??
    }
    return (<>
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this
                                    message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handelDeleteCancel}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handelDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
        </Card>

    </>)
}