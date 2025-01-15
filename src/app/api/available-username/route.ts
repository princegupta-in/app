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
        // console.log("⚡~unique-username/route.ts~", usernameValidation.safeParse(queryParam)) //this was the mistake {error: Expected string, received object}
        const { success, data,error } = usernameValidation.safeParse(queryParam.username)
        if (!success) {
            return NextResponse.json({
                success: false,
                message: error.issues[0].message // i console logged to find how to get zod schema errors
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
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username", error)
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}