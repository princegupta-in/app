import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel, { User } from "@/model/User";

export default async function DELETE(req: NextRequest, { params }: {
    params: {
        messageid: string
    }
}) {
    const messageId = params.messageid
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || !session) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    try {
        //now do the actual delete logic part
        const updatedResult = await UserModel.updateOne(
            { username: user.username },
            { $pull: { message: { _id: messageId } } })//cuz key is message value is a document message hence another key value pair

        // now check ke kuch update hua v ke nii
        if (updatedResult.modifiedCount === 0) {
            return NextResponse.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }
        return NextResponse.json({
            success: true,
            message: "Message deleted"
        }, { status: 204 })

    } catch (error) {
        console.error("Error Deleting Message", error)
        return NextResponse.json({
            success: false,
            message: "Error Deleting Message"
        }, { status: 500 })
    }
}