import React, { useContext } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import img2 from "../assets/img2.png"
import image6 from "../assets/image6.jpeg"
import img8 from "../assets/img8.png"
import img10 from "../assets/img10.png"
import img12 from "../assets/img12.png"
import img13 from "../assets/img13.png"
import { useRef } from 'react'
import { useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";

import { RiImageAddFill } from "react-icons/ri";
import { userDataContext } from '../context/userContext'
import {useNavigate } from 'react-router-dom'


function Customize() {
  const navigate = useNavigate();
    const {serverUrl,
        userData, setUserData, backendImage, setBackendImage,frontendImage, setFrontendImage, selectedImage, setSelectedImage} = useContext(userDataContext)
    const inputImage = useRef() 
    const handleImage = (e) => {
        const file = e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    return (



        <div className='
w-full
min-h-screen
bg-[linear-gradient(to_top,#000000,#020617,#1a2747,#0f4c81)]

flex
justify-center
items-center
flex-col
'>
  <div
    onClick={() => navigate("/")}
    className='
    absolute
    
    top-2 left-2
sm:top-6 sm:left-6
    sm:top-6 sm:left-6
  
    w-12 h-12
    sm:w-14 sm:h-14
  
    rounded-full
  
    bg-white/10
    backdrop-blur-md
  
    border border-white/20
  
    flex
    items-center
    justify-center
  
    cursor-pointer
  
    shadow-[0_0_20px_rgba(59,130,246,0.25)]
  
    hover:scale-110
    hover:border-cyan-400
    hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
  
    transition-all
    duration-300
    z-50
    '
  >
    <MdOutlineKeyboardBackspace
      className='
      text-white
      sm:w-2 md:h-2
      h-[200px] sm:h-[350px] md:h-[400px]
      '
    />
  </div>

        <h1
  className='
  text-white
mt-10 sm:mt-0
  text-[28px]
  sm:text-[24px]
  md:text-[42px]

  font-bold
  text-center

  leading-tight

  mb-8
  '
>
  Choose Your
  <span
    className='
    text-transparent
    bg-clip-text
    bg-gradient-to-r
    from-blue-400
    to-cyan-300

    drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]
    '
  >
    {" "}AI Assistant
  </span>
</h1>
            <div
                className='
    w-[100%]
    max-w-[1250px]

    flex
    justify-center
    items-center
    flex-wrap

    gap-4
sm:gap-5
md:gap-6
lg:gap-10

    py-0
    '
            >

                <Card image={image2} />
                <Card image={image1} />
                <Card image={img8} />
                <Card image={image6} />
                <Card image={img13} />
                <Card image={img10} />
                <Card image={img2} />
                <Card image={img12} />
                
                
                <div
  className=
  {`relative

  w-[95px] h-[145px]
  sm:w-[115px] sm:h-[170px]
  md:w-[150px] md:h-[220px]
  lg:w-[200px] lg:h-[300px]

  rounded-2xl

  bg-gradient-to-br
  from-[#102040]
  via-[#0f172a]
  to-black

  border border-blue-500/30

  overflow-hidden

  flex
  flex-col
  justify-center
  items-center

  cursor-pointer

  transition-all duration-300

  hover:scale-105
  hover:border-blue-400
  hover:shadow-[0_0_30px_rgba(59,130,246,0.45)]

  group
  ${selectedImage=="input"? "border-2 border-cyan-500 scale-105 shadow-[0_0_60px_rgba(34,211,238,0.8)] ring-2 ring-cyan-300/50" :null}`}
  
  onClick={() => {
    inputImage.current.click()
    setSelectedImage("input")
    }}
>

  {/* glow */}
  <div
    className='
    absolute

    w-[70px] h-[70px]
    sm:w-[90px] sm:h-[90px]

    bg-blue-500/20
    blur-2xl
    rounded-full

    group-hover:bg-blue-400/30

    transition-all duration-300
    '
  />

  {
  !frontendImage ? (

    <>
      {/* icon */}
      <div
        className='
        relative
        z-10

        w-[42px] h-[42px]
        sm:w-[52px] sm:h-[52px]
        md:w-[60px] md:h-[60px]

        rounded-full

        bg-white/10
        border border-white/20

        backdrop-blur-md

        flex
        justify-center
        items-center
        '
      >

        <RiImageAddFill
          className='
          text-white

          text-[20px]
          sm:text-[24px]
          md:text-[28px]

          transition-all duration-300
          group-hover:scale-110
          '
        />

      </div>

      {/* text */}
      <div className='relative z-10 text-center mt-3'>

        <h2
          className='
          text-white
          font-semibold

          text-[10px]
          sm:text-[12px]
          md:text-[14px]
          '
        >
          Upload Your AI
        </h2>

        <p
          className='
          text-gray-400

          text-[8px]
          sm:text-[10px]

          mt-1
          px-2
          '
        >
          Add custom assistant
        </p>

      </div>
    </>

  ) : (

    <img
  src={frontendImage}
  alt="Uploaded"
  className='
  absolute
  top-0
  left-0

  w-full
  h-full

  object-cover
  rounded-2xl

  '
/>

  )
}

</div>
<input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} /> 
            </div>
        {selectedImage && <button className='
  w-[140px]
  sm:w-[170px]
  md:w-[190px]
  lg:w-[220px]

  h-[48px]
  md:h-[55px]

  mt-6

  bg-gradient-to-r
  from-cyan-500
  via-blue-500
  to-indigo-600

  rounded-full

  text-white
  font-semibold

  shadow-[0_0_25px_rgba(59,130,246,0.5)]

  hover:scale-105
  hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]

  transition-all
  duration-300
  cursor-pointer
  ' onClick={()=>{
                      navigate("/customize2")
                      console.log (" clicked")
                      }}>Next</button>}
        </div>
    )
}

export default Customize