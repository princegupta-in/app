import {z} from "Zod";


export const messageSchema = z.object({
    content:z
    .string()
    .min(10,{message:"minimum length is 10 character"})
    .max(300,{message:"maximum length is 300 character"})
})