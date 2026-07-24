import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const{loading,handleRegister} = useAuth();

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async(e)=>{
    e.preventDefault();

    await handleRegister({username,email,password})
    navigate("/")
  }

  if(loading){
    return (<main><h1 className='text-center'>LOADING....</h1></main>)
  }

  return (
    <div className="h-screen bg-[#151515] flex items-center justify-center">
      <div className="w-90 h-90 rounded-2xl flex flex-col justify-center gap-2.5">
        <h1 className="text-3xl font-bold text-[#F4F4F4] ">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col gap-4 ">

            <div >
            <label className="text-[#C5C5C]5 mb-2 font-normal ">
              Username
            </label>
            <br />
            <input
              onChange={(e)=>{setUsername(e.target.value)}}
              type="text"
              placeholder="Enter Username"
              className="w-full h-10 text-[12px] font-semibold text-gray-950 bg-amber-50 border rounded-xl outline-none"
            />
          </div>

          <div >
            <label className="text-[#C5C5C5] mb-2 font-normal ">
              Email
            </label>
            <br />
            <input
              onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              placeholder="Enter email address"
              className="w-full h-10 text-[12px] font-semibold text-gray-950 bg-amber-50 border rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block text-[#C5C5C5]  mb-2 font-medium">
              Password
            </label>
            <input
              onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              placeholder="Enter password"
              className="w-full h-10 text-[12px] font-semibold text-gray-950 border rounded-xl outline-none bg-amber-50"
            />
          </div>

          <button type='submit' className="w-full h-9 bg-red-400 text-white rounded-3xl font-semibold cursor-pointer">
            Register
          </button>

          <p className="text-center text-[#C5C5C5]">
            Already have an account?{" "}
            <button type='button' onClick={() => navigate("/login")} className="text-red-400 cursor-pointer hover:underline">
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
