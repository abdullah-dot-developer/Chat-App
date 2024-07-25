import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import userRoutes from "./routes/user.routes.js"

import connectToMongoDB from "./db/connectToMongoDB.js";

import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./socket/socket.js"


dotenv.config();

const PORT = process.env.PORT;

app.use(express.json()); //to parse the incoming data as json payload (from req.body)
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true // allows cookies to be sent with requests
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//     //root route
//     res.send("Hello World!")
// })

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is listening on Port ${PORT}`)

})