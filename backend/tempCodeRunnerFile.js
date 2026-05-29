import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"     
import authRouter from "./routes/auth.routes.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/users", authRouter);
app.get("/", function (req, res){
    res.send("hii there")
})

app.listen(port, () => {
    connectDb();
    console.log("Server started")
});