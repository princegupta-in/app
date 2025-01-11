import mongoose, { Schema, model, connect } from 'mongoose';


export interface Message extends Document {
    content: string; //small s
    createdAt: Date;
}

//type of this is schema, konsa schema, message schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,//capital s
        required: [true, "content required"]
    },
    createdAt: {
        type: Date,
        reqired: [true, "created time required"],
        default: Date.now
    }
})

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified:boolean,
    isAcceptingMessage: boolean,
    message: Message[]
}

const userSchema = new Schema<User>({
    username: { type: String, trim: true, unique: true, required: [true, "username is mandatory field"] },
    email: { type: String,unique:true, required: [true, "email is mandatory field"], match:[/.+\@.+\..+/,"please use a valid email"] },
    password: { type: String, required: [true, "Password is required"] },
    verifyCode: { type: String, required: [true, "verification code is required"] },
    isVerified: { type: Boolean, default:false},
    isAcceptingMessage: { type: Boolean, required: true },
    message: [MessageSchema]
})

// exporting modles: cuz Next.js includes Edge Functions, hence if model already exist use that else create new
const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("UserModel",userSchema)
export default UserModel