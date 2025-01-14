import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(req: NextRequest) {

    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user

    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "user not Authenticated/signed-in"
        }, { status: 403 })
    }

    // const userId = user._id
    //when using agregation pipeline this field need to be mongoose objectId, as in the jwt callback we converted it into a string, so again need to make this mongoose objectId
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            {
                $match: { _id: userId }
            },
            {
                $unwind: "$message"
            },
            {
                $sort: { "message.createdAt": -1 }
            },
            {
                $group: { _id: "_id", messages: { $push: "$message" } }
                //want to keep 2 fields :_id and messages
            }
        ])

        //if user not found
        if (!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 403 })
        }

        //else
        return NextResponse.json({
            success: false,
            message: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.error("Internal server error: ", error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 405 })
    }

}