import dns from "node:dns"
import mongoose from "mongoose"
import { dbName } from "../constant.js"

dns.setServers(["8.8.8.8", "1.1.1.1"])


export const connectDb = async () => {
    try {
        const rawUri = (process.env.MONGO_URI || "").trim();
        const hasDbName = /^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/.test(rawUri);
        const connectionUri = hasDbName
            ? rawUri
            : rawUri.endsWith('/')
            ? `${rawUri}${dbName}`
            : `${rawUri}/${dbName}`;

        const connectionInstance = await mongoose.connect(connectionUri);
        console.log(`database is connected with host : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("database connection failed with error : ", error);
        process.exit(1);
    }
}