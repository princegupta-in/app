import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { username, otp } = await req.json()

        const decodedUsername = decodeURIComponent(username)
        console.log("⚡~otp-verification~", decodedUsername)

        const user = await UserModel.findOne({ username: decodedUsername })

        //not found user
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, { status: 500 })
        }

        //check otp valid
        //https://chatgpt.com/share/6783e70a-9d24-8007-ae1c-712a585c91cf
        const isCodeValid = user.verifyCode === otp
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        //if all good update, mark user as verified and save()
        if (isCodeNotExpired && isCodeValid) {
            user.isVerified = true;
            await user.save()
            return NextResponse.json({
                success: true,
                message: "user account verified successfully"
            }, { status: 200 })
        }

        //else
        if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "verification code had expired, please signup again"
            }, { status: 500 })
        }
        if (!isCodeValid) {
            return NextResponse.json({
                success: false,
                message: "incorrect verification code"
            }, { status: 500 })
        }

    } catch (error) {
        console.error("otp verification failed")
        return NextResponse.json({
            success: false,
            message: "otp verification failed"
        }, { status: 500 })
    }
}