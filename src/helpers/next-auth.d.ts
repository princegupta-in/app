import "next-auth"
import { DefaultSession } from "next-auth";

// https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties
//modifying the default interface so can use in callbacks of jwt and session
declare module "next-auth"{
    interface User{
        _id?:string;
        isVerified :boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
    interface Session{
        user:{
            _id?:string;
        isVerified? :boolean;
        isAcceptingMessages?:boolean;
        username?:string;
        }& DefaultSession["user"]
    }
}

declare module "next-auth/jwt"{
    interface JWT{
        _id?:string;
        isVerified? :boolean;
        isAcceptingMessages?:boolean;
        username?:string;
    }
}