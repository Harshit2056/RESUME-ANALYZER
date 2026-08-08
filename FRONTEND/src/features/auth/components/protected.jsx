import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom';


 const Protected = ({children}) =>{
    const {loading,user} = useAuth();

    

    if (loading ) {
      return (
      <div className="min-h-screen bg-[#0D1117] text-white flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mb-4" />
        <h1 className="text-base font-heading font-semibold text-slate-300">Loading...</h1>
      </div>
      );
   }

    if(!user){
       return <Navigate to="/login"  />;
    }
    return children;
  }

  export default Protected;


