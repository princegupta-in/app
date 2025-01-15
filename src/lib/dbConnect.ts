import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number //? is cuz of empty object
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("connecion to database already exist")
        // console.log(connection)// {isConnected: 1}
        return;
    }
    try {
        // const db = await mongoose.connect("mongodb+srv://princetsx:vO802VK4zLUt28SQ@cluster0.eden5.mongodb.net/")
        const db = await mongoose.connect(process.env.MONGO_URL!)

        // console.log("💲inside /lib/dbConnect.ts",db)
        connection.isConnected = db.connections[0].readyState

        console.log("db connected succesfully")
    } catch (error) {
        console.log("database connection failed⌛⌛", error)

        //failed connection,hence exit the process
        process.exit(1)
    }

}
export default dbConnect;
