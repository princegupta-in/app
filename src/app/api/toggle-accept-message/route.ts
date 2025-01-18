import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth"; //this User is default interface from next-auth for session


//to toggle is accepting msg
export async function POST(req: NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated/ not signed-in"
        }, { status: 402 })
    }

    const userId = user._id

    //feedback that random ppl will send🔥🔥🔥🔥
    // const { feedbackMessage } = await req.json()
    const { acceptMessagesBooleanFlag } = await req.json() //true/false

    try {
        //search for the user and update
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { isAcceptingMessage: acceptMessagesBooleanFlag } },
            { new: true }
        )
        //if user not found
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "user not found and update the user"
            }, { status: 401 })
        }
        //else return success
        if (updatedUser) {
            return NextResponse.json({
                success: true,
                message: "Message acceptance status updated successfuly"
            }, { status: 201 })
        }
    } catch (error) {
        console.error("failed to update user status to accept messages")
        return NextResponse.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }

}

//to check is accepting msg
export async function GET(req: NextRequest) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 402 })
    }

    const userId = user._id
    try {
        const userExist = await UserModel.findById(userId)
        if (!userExist) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, { status: 402 })
        }

        return NextResponse.json({
            success: true,
            message: "user found",
            isAcceptingMessage: userExist.isAcceptingMessage
        }, { status: 204 })
    } catch (error) {
        console.error("error in getting isAccepting messages")
        return NextResponse.json({
            success: false,
            message: "error in getting isAccepting messages"
        }, { status: 500 })
    }
}
//nextwork:get endpoint for getting list of all feedbacks