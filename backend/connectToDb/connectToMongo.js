import mongoose from "mongoose"

export const connectToMongo = () => {
    try {
        mongoose.connect(process.env.MONGO).then(() => {
            console.log("Connected to MongoDB") ;
        })

    }catch(err) {
        console.error("Failed to connect to MongoDB", err) ;

    }finally {
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB connection disconnected") ;
        }) ;

    }
}