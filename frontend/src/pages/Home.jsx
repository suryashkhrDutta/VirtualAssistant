import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { GiCrossMark } from "react-icons/gi";

import { CgMenuRight } from "react-icons/cg";

import { useState } from 'react';
import { useRef } from 'react';
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif"
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText,setUserText] = useState("")
  const [aiText,setAiText] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [showWakeMessage, setShowWakeMessage] = useState(true)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")

    } catch (error) {
      setUserData(null)
      console.error("Error logging out:", error)
    }
  }

  //speak feature
  // const speak = (text) => {
  //   const utterence = new SpeechSynthesisUtterance(text)
  //   synth.speak(utterence)
  // }

  const startRecognition = () => {
    try {      recognitionRef.current?.start()
      setListening(true);
    }  catch (error) {
      if(!error.message.includes("InvalidStateError")){
        console.error("Recognition error: ", error);
      }
    }
  }

  const speak = (text) => {
  setUserText("")
  setAiText(text)

  isSpeakingRef.current = true

  const utterance = new SpeechSynthesisUtterance(text)

  utterance.onend = () => {
    isSpeakingRef.current = false

    setAiText("")

    setTimeout(() => {
      startRecognition()
    }, 500)
  }

  synth.speak(utterance)
}

  const handleCommand = (data) => {

   if (!data) {
    speak("Sorry, I am unavailable right now.");
    return;
  }

  const { type, userInput, response } = data;

  speak(response);

  switch (type) {

      case "google_search":
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;

      case "youtube_search":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;

      case "youtube_play":
        window.open(
          `https://www.youtube.com/results?search_query=${encodeURIComponent(userInput)}`,
          "_blank"
        );
        break;

      case "google_open":
        window.open("https://www.google.com", "_blank");
        break;

      case "youtube_open":
        window.open("https://www.youtube.com", "_blank");
        break;

      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;

      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;

      case "calculator_open":
        window.open("calculator://");
        break;

      case "weather_show":
        window.open(
          `https://www.google.com/search?q=weather`,
          "_blank"
        );
        break;

      default:
        break;
    }
  };



  //setting up voice recognition
  useEffect(() => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new SpeechRecognition()
    recognition.continuous = true,
      recognition.lang = 'en-US'

      recognitionRef.current = recognition
      const isRecognizingRef={current:false}

      const safeRecognition = ()=>{
        if(!isSpeakingRef.current && !isRecognizingRef.current){
          try {
            recognition.start()
            console.log("recognition requested to start");
          } catch (err) {
              if(err.name !== "InvalidStateError"){
                console.error("Start error: ", err);
              }
          }
        }
      }

      recognition.onstart=()=>{
        console.log("Recognition started");
        isRecognizingRef.current = true;
        setListening(true);
      };

      recognition.onend=()=>{
        console.log("Recognition ended");
        isRecognizingRef.current = false;
        setListening(false);

        if(!isSpeakingRef.current){
          setTimeout(()=>{
            safeRecognition()
          }, 1000); //delay avoids rapid loop
        }
      }

      recognition.onerror=(event)=>{
        console.warn("Recognition error: ", event.error);
        isRecognizingRef.current = false;
        setListening(false);
        if(event.error !=="aborted" && !isSpeakingRef.current){
          setTimeout(()=>{
            safeRecognition()
          }, 1000);
        }
      }

     


    recognition.onresult = async (e) => {
  const transcript =
    e.results[e.results.length - 1][0].transcript.trim()

  console.log("heard : " + transcript)

  if (
    transcript.toLowerCase().includes(
      userData.assistantName.toLowerCase()
    )
  ) {
    setShowWakeMessage(false)
    setAiText("")
    setUserText(transcript)

    const command = transcript.toLowerCase()

    // Local commands (NO GEMINI)

    if (command.includes("time")) {
      speak(`Current time is ${new Date().toLocaleTimeString()}`)
      return
    }

    if (command.includes("date")) {
      speak(`Today's date is ${new Date().toLocaleDateString()}`)
      return
    }

   if (
 command === "youtube" ||
 command === "open youtube"
){
  window.open("https://youtube.com","_blank")
  speak("Opening YouTube")
  return
}

    if (
  command === "google" ||
  command === "open google"
){
  window.open("https://google.com","_blank")
  speak("Opening Google")
  return
}

    // Gemini only for complex queries
    const data = await getGeminiResponse(transcript)

    if (!data) {
      speak("Sorry, I am unavailable right now.")
      return
    }

    handleCommand(data)
    
    
  }
}
  const fallback = setInterval(()=>{
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      safeRecognition()
  }},10000)

  safeRecognition()
  return () => {    recognition.stop()
    setListening(false)
  isRecognizingRef.current = false;
    clearInterval(fallback)
  }


  }, [])

  return (
    <div
      className='
  w-full
  min-h-screen

  bg-[linear-gradient(to_top,#000000,#020617,#1a2747,#0f4c81)]

  flex
  flex-col
  justify-center
  items-center

  px-4
  '
    >

      <p
        className='
    text-cyan-300
    uppercase
    tracking-[6px]
    text-xs
    sm:text-sm

    
    mt-10
    mb-0
    '
      >
        Your Virtual Assistant
      </p>
      

      <h1
        className='
    text-white

    text-[32px]
    sm:text-[42px]
    md:text-[52px]

    font-bold

    mb-2

    text-center
    '
      >
        I'm{" "}
        <span
          className='
      text-transparent
      bg-clip-text
      bg-gradient-to-r
      from-cyan-300
      to-blue-500

      drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]
      '
        >
          {userData?.assistantName}
        </span>
      </h1>
      <div className="flex items-center gap-2 mb-2">
  <div
    className={`
      w-3 h-3 rounded-full
      ${
        listening
          ? "bg-green-400 animate-pulse shadow-[0_0_15px_rgba(74,222,128,1)]"
          : "bg-red-400"
      }
    `}
  />

  <span
    className={`
      text-sm font-medium
      ${
        listening
          ? "text-green-300"
          : "text-red-300"
      }
    `}
  >
    {listening ? "Listening..." : "Standby"}
  </span>
</div>
{showWakeMessage && (
  <p
    className="
    text-cyan-200/70
    text-sm
    mb-4
    tracking-wide
    animate-pulse
    "
  >
    Say "{userData?.assistantName}" to wake me up
  </p>
)}
    
      <div
        className='
    relative
    mt-4 sm:mt-8
    w-[220px]
h-[220px] sm:h-[380px] md:h-[450px]

md:w-[320px]
md:h-[450px]
    rounded-[32px]
    overflow-hidden

    border border-cyan-500/30

    shadow-[0_0_50px_rgba(59,130,246,0.45)]

    group
    mb-4
    cursor-pointer
    '
      >

        <div
  className='
      absolute
      -inset-8
      bg-cyan-500/20
      blur-[100px]
      animate-pulse



      group-hover:bg-cyan-500/20

      transition-all
      duration-500
      
      '
      />

        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className='
          w-full
          h-full
          
          object-cover
          
          transition-all
          duration-500
          
          group-hover:scale-115
          
      '
        />

      </div>
      
      <div className="mt-6 flex flex-col items-center gap-4">

  <div className="relative w-[100px] sm:w-[160px] h-[160px]">

    <img
      src={userImg}
      alt="User"
      className={`
        absolute inset-0 w-full h-full object-contain
        transition-opacity duration-300
        ${aiText ? "opacity-0" : "opacity-100"}
      `}
    />

    <img
      src={aiImg}
      alt="AI"
      className={`
        absolute inset-0 w-full h-full object-contain
        transition-opacity duration-300
        ${aiText ? "opacity-100" : "opacity-0"}
      `}
    />

  </div>

  {aiText && (
    <div
      className="
      max-w-[450px]
      bg-cyan-500/10
      backdrop-blur-md
      border border-cyan-400/20
      rounded-2xl
      px-5
      py-3
      text-cyan-100
      text-center
      shadow-lg
      "
    >
      {aiText}
    </div>
  )}

</div>
{/* Mobile Hamburger */}
{!menuOpen && (
  <CgMenuRight
    onClick={() => setMenuOpen(true)}
    className="
    lg:hidden
    text-white
    absolute
    top-4
    right-4
    w-7
    h-7
    cursor-pointer
    z-50
    "
  />
)}
{menuOpen && (
  <div
    className={`
fixed inset-0 z-40 flex justify-end
transition-all duration-300 ease-out
${menuOpen
  ? "bg-black/40 backdrop-blur-lg"
  : "bg-black/0 backdrop-blur-none pointer-events-none"}
`}
  >
    <div
      className={`
w-[260px]
h-full
bg-white/10
backdrop-blur-2xl
border-l
border-cyan-500/20
shadow-[-10px_0_40px_rgba(0,0,0,0.4)]
p-6
flex
flex-col
gap-4

transform
transition-transform
duration-500
ease-[cubic-bezier(0.22,1,0.36,1)]

${menuOpen ? "translate-x-0" : "translate-x-full"}
`}
    >
      <GiCrossMark
        onClick={() => setMenuOpen(false)}
        className="
   text-white
   w-5
   h-5
   self-end
   cursor-pointer
   mb-6
   "
      />

      <button
        onClick={() => navigate("/customize")}
        className="
h-[50px]
rounded-xl
bg-cyan-500/20
border
border-cyan-400/30
text-white
backdrop-blur-md
cursor-pointer
hover:scale-105
hover:bg-cyan-500/30
transition-all
"
      >
        Customize Assistant
      </button>

      <button
        onClick={handleLogOut}
        className="
h-[50px]
rounded-xl
bg-red-500/10
border
border-red-400/30
text-red-300
backdrop-blur-md
cursor-pointer
hover:scale-105
hover:bg-red-500/20
transition-all
"
      >
        Log Out
      </button>
    </div>
  </div>
)}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
      
        <button
          className='
    w-[200px]
h-[50px]
rounded-xl
bg-cyan-500/20
backdrop-blur-md
border border-cyan-400/30
text-white
hidden
lg:block
hover:scale-[1.03]
active:scale-[0.98]
transition-all
duration-200
transition-all

    cursor-pointer
    '
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>

        <button
          className='
    w-[200px]
h-[50px]
rounded-xl
bg-red-500/10
backdrop-blur-md
border border-red-400/30
text-red-300
hidden
lg:block
hover:scale-[1.03]
active:scale-[0.98]
transition-all
duration-200
transition-all

    cursor-pointer
    '
          onClick={handleLogOut}
        >
          Log Out
        </button>

      </div>


    </div>
  )
}

export default Home