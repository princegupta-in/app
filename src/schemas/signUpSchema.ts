import { z } from "Zod";

export const usernameValidation = z
    .string()
    .min(3, "min length is 3")
    .max(20, "can't exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "only letters,numbers and _ is allowed")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 character" })


})
