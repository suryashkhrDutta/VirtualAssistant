import React, { useContext, useEffect } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useState } from 'react';
import { useRef } from 'react';
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
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
  isSpeakingRef.current = true;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.onend = () => {
    isSpeakingRef.current = false;

    setTimeout(() => {
      startRecognition();
    }, 500);
  };

  synth.speak(utterance);
};

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

    // if (command.includes("google")) {
    //   window.open("https://google.com", "_blank")
    //   speak("Opening Google")
    //   return
    // }
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

  //   useEffect(() => {

  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition;

  //   const recognition = new SpeechRecognition();

  //   recognition.continuous = true;
  //   recognition.interimResults = false;
  //   recognition.lang = "en-US";

  //   recognition.onresult = (e) => {

  //     let transcript = "";

  //     for (let i = 0; i < e.results.length; i++) {
  //       transcript += e.results[i][0].transcript + " ";
  //     }

  //     console.log("heard:", transcript.trim());
  //   };

  //   recognition.start();

  //   return () => recognition.stop();

  // }, []);




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
    tracking-[4px]
    text-xs
    sm:text-sm

    mb-3
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

    mb-8

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

      <div
        className='
    relative

    w-[280px]
    h-[380px]

    sm:w-[320px]
    sm:h-[450px]

    rounded-[32px]
    overflow-hidden

    border border-cyan-500/30

    shadow-[0_0_50px_rgba(59,130,246,0.45)]

    group
    '
      >

        <div
          className='
      absolute
      inset-0

      bg-blue-500/10
      blur-3xl

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
      <div
        className='
  flex
  flex-col
  sm:flex-row

  gap-4

  mt-8
  w-full
  max-w-[500px]

  justify-center
  items-center
  '
      >

        <button
          className='
    w-[220px]
    h-[55px]

    rounded-full

    bg-gradient-to-r
    from-cyan-500
    via-blue-500
    to-indigo-600

    text-white
    font-semibold

    shadow-[0_0_25px_rgba(59,130,246,0.5)]

    hover:scale-105
    hover:shadow-[0_0_40px_rgba(59,130,246,0.8)]

    transition-all
    duration-300

    cursor-pointer
    '
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>

        <button
          className='
    w-[220px]
    h-[55px]

    rounded-full

    bg-white/10
    backdrop-blur-md

    border
    border-red-500/30

    text-red-300
    font-semibold

    shadow-[0_0_20px_rgba(239,68,68,0.2)]

    hover:scale-105
    hover:bg-red-500/10
    hover:border-red-400

    transition-all
    duration-300

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