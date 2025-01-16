"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"


export default function Navbar() {


    const { data: session, status } = useSession()

    return (
        <nav className="p-4 md:p-6 shadow-md">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <Link className="text-xl font-bold mb-4 md:mb-0" href={"/dashboard"}>go to dashboard</Link>
                {session ? (
                    <>
                        <p className="mr-4">Welcome, {session.user.username}</p>
                        <Button className="w-full md:w-auto" onClick={() => { signOut }}>Logout</Button>
                    </>
                ) : (
                    <Button className="w-full md:w-auto" onClick={() => { signIn }}>Login</Button>
                )}
            </div>
        </nav>
    )
}

