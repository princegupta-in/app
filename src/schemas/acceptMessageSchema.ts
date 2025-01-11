import {z} from "Zod";


export const acceptMessageSchema = z.object({
    acceptMessages:z.boolean()
})