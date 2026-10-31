import dotenv from "dotenv";
dotenv.config();

import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { User } from "./models/user.model.js";
import { connectDb } from "./db/connnection.js";

async function createAdmin() {
    try {
        await connectDb();

        const email = process.argv[2] || "admin@example.com";
        const password = process.argv[3] || "adminpassword123";

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: "Admin",
                email: email,
                password: password,
                role: "admin",
                accessLevel: "both",
                deniedAccess: "no",
                corrupted: false,
                isFreezed: false
            });
            console.log(`\nSUCCESS: Created admin user:\n  Email: ${email}\n  Password: ${password}\n  Role: admin\n`);
        } else {
            user.password = password;
            user.role = "admin";
            user.deniedAccess = "no";
            await user.save();
            console.log(`\nSUCCESS: Existing user updated as admin:\n  Email: ${email}\n  Password: ${password}\n  Role: admin\n`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Failed to create admin:", err);
        process.exit(1);
    }
}

createAdmin();
