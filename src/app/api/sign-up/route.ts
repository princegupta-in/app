import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect()

    try {
        const { username, email, password } = await req.json()

        //check with username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        })
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exist"
            }, { status: 400 })
        }

        //check with email id
        const existingUserByEmail = await UserModel.findOne({
            email,
            isVerified: true
        })

        if (existingUserByEmail) {
            return NextResponse.json({
                success: false,
                message: "email already exist"
            }, { status: 400 })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        //then create the user
        if (!existingUserVerifiedByUsername || !existingUserByEmail) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })
            await newUser.save()
        }

        //send verification mail
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log("src/app/api/signup/route.ts :)", emailResponse)
        if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message//explore this
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User registered successfully. please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.log("Error in user registration", error)
        return NextResponse.json({
            message: "Error in user registration",
            sucess: false
        }, { status: 500 })
    }
}