import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import moment from 'moment'
import { response } from "express"
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        return res.status(200).json({
            user
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body
        let assistantImage;

        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path)
        }
        else {
            assistantImage = imageUrl
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage
        }, { new: true }).select("-password")
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({
            message: "get current user error"
        })
    }
}

export const askToAssistant = async (req, res) => {
    try {

        const { command } = req.body
        if (
    command.toLowerCase().includes("date") &&
    command.toLowerCase().includes("time")
) {
    return res.json({
        response: `Today is ${moment().format("YYYY-MM-DD")} and the current time is ${moment().format("hh:mm A")}`
    });
}
        const user = await User.findById(req.userId);
        const userName = user.name

        const assistantName = user.assistantName
        const result = await geminiResponse(command,assistantName,userName)

        const jsonMatch = result.match(/{[\s\S]*}/)
        if (!jsonMatch) {
            return res.status(400).json({ response: "sorry, i cannot understand" })
        }

        const gemResult = JSON.parse(jsonMatch[0])
        const type = gemResult.type

        switch (type) {
            case 'get_date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get_time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format("hh:mm A")}`
                });
            case 'get_day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                });
            case 'get_month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("MMMM")}`
                });
            case 'general':
            case 'google_search' :
            case 'youtube_search' :
            case 'youtube_play' :
            case 'calculator_open' :
            case 'instagram_open' :
            case 'facebook_open' :
            case 'weather_show' :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response : gemResult.response,

                });
                default :
                    return res.status(400).json({ response : "Did not understand the command. "})
        }

    } catch (error) {
                   return res.status(500).json({ response : "Ask assistant error. "})
    }
}