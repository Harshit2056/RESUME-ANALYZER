import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { logout,login,register,getuser, resetPassword,forgotPassword } from "../services/auth.api.jsx";

export const useAuth = () =>{

    const context = useContext(AuthContext)
    const {user,setUser,loading,setLoading} = context
     
    

    const handleLogin = async({email,password})=>{
        
        setLoading(true)

        try {
            const data= await login({email,password})
            setUser(data.data.LoggedInUser)
            return true;
            
        } catch (error) {
            console.log(error)
            return false;
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async({username,password,email})=>{
        setLoading(true)
        try {
            const data = await register({email,password,username})
            setUser(data.data.user)
            return true;
        } catch (error) {
            return false;
        }finally{
            setLoading(false)
        }
        
    }

    const handleLogout = async()=>{
        setLoading(true)
        try {
            const data =await logout()
            setUser(null)
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
        
    }

    const handleForgotPassword = async ({ email }) => {
        setLoading(true);
        try {
            const data = await forgotPassword({ email });
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async ({ token, password }) => {
        setLoading(true);
        try {
            const data = await resetPassword({ token, password });
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        handleLogin,
        handleLogout,
        handleRegister,
        handleResetPassword,
        handleForgotPassword,
        handleforgotPassword: handleForgotPassword,
        loading
    };
}