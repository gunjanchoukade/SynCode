import { createContext, useEffect, useRef } from "react";
import io from "socket.io-client";
export const context = createContext();
const SocketContext = ({children})=>{
    
    const socketRef = useRef(io.connect(`${import.meta.env.VITE_BACKEND_URL}`));
    useEffect(()=>{
        socketRef.current.on("connection",()=>{
            console.log("Connected to socket server");
        });
    },[])
    
    const value = {socketRef};
    return(
        <context.Provider value={value}>
            {children}
        </context.Provider>
    )
}

export default SocketContext;