import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplates";
import { apiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<apiResponse> { //return type is promise of type apiResponse
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Opinify Verification Code',
            react: VerificationEmailTemplate({ username, otp }),
        });
        return { success: true, message: "Verification Email send successfully" }

    } catch (error) {
        console.error("Error in sending verification email", error)
        return { success: false, message: "Error in sending verification email" }
    }
}