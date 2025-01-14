//all provider here plz
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { NextAuthOptions } from "next-auth"//(alias) interface NextAuthOptions

export const authOptions: NextAuthOptions = {
    providers: [
        //https://next-auth.js.org/providers/credentials
        CredentialsProvider({
            id: "domain-login",
            name: 'Credentials',
            credentials: {
                email: { label: "Username/Email", type: "text", placeholder: "john@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<any> {
                // const {email,password} = credentials;

                await dbConnect() //first make connetion to the database
                try {
                    //my search
                    console.log("logged the credentials :)", credentials)
                    //hold the user if found in a variable
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { username: credentials?.email }
                        ]

                    })
                    //if user not found
                    if (!user) { throw new Error("Provide email/username not exist") }
                    //if user is there but is not verified
                    if (!user.isVerified) { throw new Error("User is not verified yet, kindly do verification") }
                    //if all good then verify the password
                    const ifIsPasswordCorrect = await bcrypt.compare(credentials!.password, user.password)
                    if (ifIsPasswordCorrect) {
                        return user //yes we return user if allll is well
                    } else { throw new Error("Incorrect Password") }
                }
                //If you throw an Error, the user will be sent to the error page with the error message as a query parameter :official docs https://next-auth.js.org/providers/credentials#overview
                catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    session: { //https://next-auth.js.org/configuration/options#session
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            //injecting user info into token
            //if want to modify the payload of the token can do this way
            //under the hood this user is comming form the returned user in provider
            //modify the interface src/helpers/next-auth.d.ts
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            //injecting token info into session
            if (session.user) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
            return session

        },
    },
    secret: process.env.NEXTAUTH_SECRET
}