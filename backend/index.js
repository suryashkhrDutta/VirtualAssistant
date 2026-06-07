import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"     
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import geminiResponse  from "./gemini.js"

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin : "http://localhost:5173",
        credentials: true
    }
));

app.use("/api/users", authRouter);
app.use("/api/user", userRouter);
// app.get("/", function (req, res){
//     res.send("hii there")
// })





app.listen(port, () => {
    connectDb();
    console.log("Server started")
}); 