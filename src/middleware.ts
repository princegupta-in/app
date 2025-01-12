import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
// This is an example of how to read a JSON Web Token from an API route//https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken
import { getToken } from "next-auth/jwt"


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    //grap the url
    const url = request.nextUrl

    //if user have token and wana to go to following routes, redirect them
    if (token && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up") || url.pathname.startsWith("/verify") || url.pathname.startsWith("/"))) {
        return NextResponse.redirect(new URL('/home', request.url))
    }
    // but if not have token
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/dashboard/:path*",
        "/verify/:path*"
    ]
}