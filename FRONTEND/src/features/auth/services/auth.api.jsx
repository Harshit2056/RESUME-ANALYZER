import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:4000/api",
    withCredentials:true
})

export const register = async({username,password,email})=>{
    try {
        const response = await api.post("/auth/register",{
            username,
            password,
            email
        })

        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const login = async({email,password})=>{
    try {
        const response = await api.post("/auth/login",{
            password,
            email
        })
    
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const logout = async()=>{
    try {
        const repsonse = await api.get("/auth/logout")
    
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const getuser = async()=>{
    try {
        const response = await api.get("/auth/current-user")
        
        return response.data
    } catch (error) {
        console.log(error)
    }
}