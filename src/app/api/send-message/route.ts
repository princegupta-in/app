import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User"; //this is Message interface not model
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    await dbConnect();

    const { username, content } = await req.json()
    try {
        const user = await UserModel.findOne({ username })
        //user absent
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        //user present but not accepting the messages
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "User not accepting messages"
            }, { status: 405 })
        }

        //user present and accepting the messages
        //then just grab the message from random ppl
        const newMESSAGE = { content, createdAt: new Date() }
        user.message.push(newMESSAGE as Message) //cuz message field of userModel is array
        await user.save()

        return NextResponse.json({
            success: true,
            message: "message delivered successfully!"
        }, { status: 201 })

    } catch (error) {
        console.error("Internal server error: ", error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 405 })
    }
}
