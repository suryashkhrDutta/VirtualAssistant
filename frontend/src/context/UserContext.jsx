import React, { createContext, useEffect, useState } from 'react'
import axios from "axios"


export const userDataContext = createContext()

function UserContext({ children }) {

    const serverUrl = "http://localhost:5000"

    const [userData, setUserData] = useState(null)
    const[frontendImage, setFrontendImage] = useState(null);
    const[backendImage, setBackendImage] = useState(null);
    const[selectedImage, setSelectedImage] = useState(null);

    const handleCurrentUser = async () => {

        try {

            let result = await axios.get(
                `${serverUrl}/api/user/current`,
                { withCredentials: true }
            )

            setUserData(result.data.user)

            console.log(result.data.user)

        } catch (error) {

    console.log(error.response)

    console.error("Error fetching current user:", error)

}
    }

    const getGeminiResponse = async(command)=>{
        try {
            const result = await axios.post(`${serverUrl}/api/user/asktoassistant`, {command}, {withCredentials: true})
            return result.data
        } catch (error) {
            console.error("Error fetching Gemini response:", error)
        }
    }

    useEffect(() => {

        handleCurrentUser()

    }, [])

    const value = {
        serverUrl,
        userData, setUserData, backendImage, setBackendImage,frontendImage, setFrontendImage, selectedImage, setSelectedImage,
        getGeminiResponse
        
        
    }

    return (

        <userDataContext.Provider value={value}>

            {children}

        </userDataContext.Provider>

    )
}

export default UserContext