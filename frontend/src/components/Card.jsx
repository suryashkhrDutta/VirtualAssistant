import React, { useContext } from 'react'
import { userDataContext } from '../context/userContext'

function Card({ image }) {
     const {serverUrl,
            userData, setUserData, backendImage, setBackendImage,frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    return (
        <div
            className=
      {`w-[95px] h-[145px]
sm:w-[115px] sm:h-[170px]
md:w-[150px] md:h-[220px]
lg:w-[200px] lg:h-[300px]

      bg-white/5
      backdrop-blur-md
      border border-blue-500/40
      rounded-2xl
      overflow-hidden

      shadow-[0_0_25px_rgba(59,130,246,0.35)]

      hover:scale-105
      hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]

      transition-all duration-300
      cursor-pointer
      ${selectedImage==image? "border-2 border-cyan-500 scale-105 shadow-[0_0_60px_rgba(34,211,238,0.8)] ring-2 ring-cyan-300/50" :null}
      `}
       onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
        }} >
            <img
                src={image}
                className="w-full h-full object-cover"
            />
        </div>
    )
}

export default Card