import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdOutlineKeyboardBackspace } from "react-icons/md";


function Customize2() {
  const{userData, backendImage, selectedImage, serverUrl, setUserData} = useContext(userDataContext)
  const[assistantName, setassistantName] = useState(userData?.AssistantName || "")
  const navigate = useNavigate() 
  const [loading, setLoading] = useState(false)
const isValidName = assistantName.trim().length > 0;


  const handleUpdateAssistant = async () => {
  try {

    setLoading(true)

    let formData = new FormData()

    formData.append("assistantName", assistantName)

    if (backendImage) {
      formData.append("assistantImage", backendImage)
    } else {
      formData.append("imageUrl", selectedImage)
    }

    const result = await axios.post(
      `${serverUrl}/api/user/update`,
      formData,
      { withCredentials: true }
    )

    console.log(result.data)

    setUserData(result.data)

    navigate("/")

  } catch (error) {

    console.log(error)

  } finally {

    setLoading(false)

  }
}

  return (
    <div className='
w-full
min-h-screen
bg-[linear-gradient(to_top,#000000,#020617,#1a2747,#0f4c81)]

px-4
sm:px-6
flex
justify-center
items-center
flex-col
relative
'>
  {/* back button */}
    <div
  onClick={() => navigate("/customize")}
  className='
  absolute
  top-4 left-4
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
    w-6 h-6
    sm:w-7 sm:h-7
    '
  />
</div>
       <h1
  className='
  text-white

  text-[24px]
  sm:text-[34px]
  md:text-[42px]

  font-bold
  text-center

  leading-tight

  mb-10
  '
>
  Name Your
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
    {" "}Virtual Assistant
  </span>
</h1>

<p
  className='
  text-gray-300
  text-center

  text-sm
  sm:text-base

  mb-8
  sm:mb-10

  px-4
  '
>
  Your personal companion starts here
</p>
<div
  className='
  w-[90%]
  max-w-[500px]

  bg-white/5
  backdrop-blur-xl

  border border-white/10

  rounded-3xl

  p-6
  sm:p-8

  shadow-[0_0_50px_rgba(59,130,246,0.15)]

  flex
  flex-col
  items-center
  gap-6
  '
>

  <p
    className='
    text-gray-300
    text-center

    text-[14px]
    sm:text-[16px]
    '
  >
    Give your AI assistant a unique identity
  </p>

  <input
    type="text"
    placeholder="e.g. Jarvis"
    className='
    w-full
    h-[55px]

    px-5

    bg-white/10
    backdrop-blur-md

    border border-white/20

    rounded-2xl

    text-white
    text-center
    text-lg

    outline-none

    focus:border-cyan-400
    focus:shadow-[0_0_20px_rgba(34,211,238,0.5)]

    transition-all
    duration-300

    placeholder:text-gray-400
    '
    onChange={(e)=>setassistantName(e.target.value)} value={assistantName}
  />
  
  <button
  disabled={!isValidName || loading}
  className={`
    w-full
    h-[55px]

    rounded-2xl

    text-white
    font-semibold

    transition-all
    duration-300

    ${
      isValidName
        ? `
          bg-gradient-to-r
          from-cyan-500
          via-blue-500
          to-indigo-600

          shadow-[0_0_25px_rgba(59,130,246,0.5)]

          hover:scale-[1.02]
          hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]

          cursor-pointer
        `
        : `
          bg-gray-700/70
          border border-gray-600
          cursor-not-allowed
          opacity-60
        `
    }
  ` } onClick={()=>{
    handleUpdateAssistant()
  }}
>
  {loading ? "Creating Assistant..." : "Create Your Assistant ✨"}
</button>

  

</div>

</div>
  )
}

export default Customize2