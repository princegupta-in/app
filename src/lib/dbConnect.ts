// import mongoose from "mongoose"

// type ConnectionObject = {
//     isConnected?: number //? is cuz of empty object
// }

// const connection: ConnectionObject = {}

// async function dbConnect(): Promise<void> {
//     if (connection.isConnected) {
//         console.log("connecion to database already exist")
//         // console.log(connection)// {isConnected: 1}
//         return;
//     }
//     try {
//         // const db = await mongoose.connect("mongodb+srv://princetsx:vO802VK4zLUt28SQ@cluster0.eden5.mongodb.net/")
//         const db = await mongoose.connect(process.env.MONGO_URL!)

//         // console.log("💲inside /lib/dbConnect.ts",db)
//         connection.isConnected = db.connections[0].readyState

//         console.log("db connected succesfully")
//     } catch (error) {
//         console.log("database connection failed⌛⌛", error)

//         //failed connection,hence exit the process
//         process.exit(1)
//     }

// }
// export default dbConnect;
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("🚩", MONGODB_URI)

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not find in .env file");
}


//checking if already have connection
//@ts-ignore
let cached = global.mongoose;

if (!cached) {
    //@ts-ignore
    cached = global.mongoose = { con: null, promise: null };
}

const dbConnect = async () => {
    if (cached.con) {
        return cached.con;
    }
    if (!cached.promise) {

        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => mongoose.connection);
    }

    try {
        cached.con = await cached.promise;
    } catch (error) {
        cached.promise = null;
    }

    return cached.con;
}
export default dbConnect;