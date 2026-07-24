import { Children, createContext,  useState,useEffect } from "react";
import { getuser } from "./services/auth.api";


export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser]= useState(null)
    const [loading, setLoading]  = useState(true)

    useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getuser();

            if (data) {
                setUser(data.data);
            }
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    getAndSetUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
        {children}
        </AuthContext.Provider>
    )
}