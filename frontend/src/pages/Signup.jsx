import React, { useContext, useState } from "react";
import bg from '../assets/abc.png';
import { IoEye, IoEyeOff } from "react-icons/io5"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"
import { userDataContext } from "../context/userContext";
import {Route, Routes,Navigate} from "react-router-dom";
function Signup() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate();
    const {serverUrl,userData, setUserData} = useContext(userDataContext)
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const handlePasswordChange = (e) => {
        const value = e.target.value
        setPassword(value)

        if (!value) {
            setShowPassword(false)
        }
    }

    const handleSignup = async (e)=>{
        e.preventDefault()
        setErr("")
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/users/signup`,{
                name, email, password
            }, {withCredentials:true})

            setUserData(result.data)
            setLoading(false)
            navigate("/customize")
        } catch (error) {
            console.log(error)
            setUserData(null)
            setLoading(false)
            setErr(error.response.data.message)
        }
    }

    return (
        <div className="w-full h-[100vh] bg-cover flex justify-center items-center " style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>

            <form className=" fixed
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    w-[90%] max-w-[500px] h-[600px]
    bg-black/10
    backdrop-blur
    border border-white/20
    shadow-xl shadow-black/40
    flex flex-col items-center justify-center gap-5
    rounded-2xl" onSubmit={handleSignup}>
                <h1 className='text-white text-[30px] font-semibold mb-[30px] px-[10px]'>   Register to <span className="text-blue-400 text-[30px] font-semibold">Virtual Assistant</span></h1>
                <input type="text" placeholder=' Username' className='w-[80%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-10 py-[10px] rounded-full  ' required onChange={(e)=> setName(e.target.value)} value={name}/>
                <input type="email" placeholder=' Email' className='w-[80%] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-10 py-[10px] rounded-full ' required onChange={(e)=> setEmail(e.target.value)} value={email}/>
   
        {/* password */}
<div className="relative w-[80%] h-[60px]">

    <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        className="absolute inset-0 w-full h-full outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-10 py-[10px] pr-14 rounded-full"
        required
        onChange={handlePasswordChange}
        value={password}
    />

    {/* Show eye only when user types */}
    {password.length > 0 && (
        <button
            type="button"
            className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? (
                <IoEye className="h-[20px] w-[25px] text-blue-400" />
            ) : (
                <IoEyeOff className="h-[20px] w-[25px] text-blue-400" />
            )}
        </button>
    )}

</div>
{err.length > 0 && <p className="text-red-500 text-[17px] font-semibold">
    *{err}
    </p>}

                <button className='
  w-[50%] mt-[30px] h-[55px]
  bg-gradient-to-r from-blue-500 to-blue-700
  text-white font-semibold text-[18px]
  rounded-full
  shadow-lg shadow-blue-500/40
  transition-all duration-300
  hover:scale-105 hover:shadow-blue-500/70
  active:scale-95
  cursor-pointer
' disabled={loading}>
  {loading ? "Signing Up..." : "Sign Up"}
</button>

<p className = 'text-[white]'>Already have an account? <span className='text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition' onClick = {()=> navigate("/signin")}>Sign In </span> </p>
            </form>



        </div>
    )
}
export default Signup;

