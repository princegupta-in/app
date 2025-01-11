import {z} from "Zod";


export const signInSchema = z.object({
    identifier:z.string(),
    password:z.string()
})