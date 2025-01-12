import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";


export async function GET(req: NextRequest) {
    // console.log("⚡~available-username~", req)
    await dbConnect();
    try {
        //localhost:3000/api/unique-username?username=prince
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }
        //zod validation
        // console.log("⚡~unique-username/route.ts~", usernameValidation.safeParse(queryParam))
        const { success, data } = usernameValidation.safeParse(queryParam)
        if (!success) {
            return NextResponse.json({
                success: false,
                message: "Invalid query Parameters"
            }, { status: 500 })
        }
        const { username }: any = data

        //check whether username is already taken
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, { status: 401 })
        }
        return NextResponse.json({
            success: true,
            message: "Username is available"
        }, { status: 401 })

    } catch (error) {
        console.error("Error checking username", error)
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}