import {z} from "Zod";


export const otpVerifySchema = z.object({
    otp:z.string().length(6,"Verification code is of 6 digit")
})