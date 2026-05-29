import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { genToken } from "../config/token.js"
import jwt from "jsonwebtoken"


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existEmail = await User.findOne({ email })
        if (existEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10)


        const user = await User.create({
            name,
            password: hashedPassword,
            email
        })


        const token = await genToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json({ user, token })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

//login controller

export const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const existEmailLogin = await User.findOne({ email })

        if (!existEmailLogin) {

            return res.status(400).json({
                message: "email does not exist"
            })

        }

        const isMatch = await bcrypt.compare(
            password,
            existEmailLogin.password
        )

        if (!isMatch) {

            return res.status(400).json({
                message: "incorrect password"
            })

        }

        const token = genToken(existEmailLogin._id)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            user: existEmailLogin,
            token
        })

    }

    catch (error) {

        console.log("LOGIN ERROR:", error)

        return res.status(500).json({
            message: error.message
        })

    }

}

//logout controller
export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "logged out successfully" })
    }
    catch (error) {
        return res.status(500).json({ message: "logout error" })
    }
}