
import {useState} from "react"
import toast from "react-hot-toast"
import {v4 as uuidV4} from "uuid"
import { useNavigate } from "react-router-dom"
const Home = ()=>{
    const[userName,setUserName] = useState("");
    const[roomId,setRoomId] = useState("");
    const navigate = useNavigate()
    const createNewRoom = (e)=>{
        e.preventDefault();
        const uuid = uuidV4();
        setRoomId (uuid);
        toast.success("Created a new room");
    }

    const joinCreatedRoom = ()=>{
        if(!roomId || !userName){
            toast.error("ROOMID & USERNAME is required");
            return;
        }
        // redirecting to editor page
        // state is used to send data to another page without using url params
        navigate(`/editor/${roomId}`,{
            state:{
                userName,  
            }
        })
        
    }

    const handleEnterSubmit = (e)=>{
        if(e.code == "Enter"){
            joinCreatedRoom();
        }
    }

    return (
        // className="bg-[#232532] h-1/2 lg:w-1/3 sm:w-full  flex flex-col  p-3 gap-5 rounded-md shadow-slate-500 shadow-md
        <div className="bg-[#1C1B27] h-screen flex justify-center items-center p-0 m-0">
            {/* whole middle box */}
            <div className="bg-[#232532] lg:w-1/3 sm:w-11/12  flex flex-col gap-10 p-10 rounded-md shadow-slate-500 shadow-md">
                {/* contains app name and logo (if) */}
                <div className=" flex gap-3 items-center">
                    <div>
                        <img className="w-20 rounded-lg" 
                        src="/download.png" alt="SynCode Logo" />
                    </div>
                    <div className="w-[2px] h-[80px] bg-orange-400 rounded-lg"></div>
                    <div className="text-white">
                        <h1 className="text-2xl font-bold">SynCode</h1>
                        <p className="text-sm opacity-70">Code together in real-time</p>
                        {/* <h2 className="text-orange-400 font-semibold opacity-70">Realtime Collaboration</h2> */}
                    </div>
                </div>
                
                {/* contains Room and Username & buttons */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-300">Paste Invitation RoomID</h2>
                    <input onChange={(e)=>setRoomId(e.target.value)} value={roomId} onKeyUp={handleEnterSubmit}
                    type="text" placeholder="ROOMID"  className="p-2 rounded-sm bg-slate-200 font-semibold outline-none" />

                    <input onChange={(e)=>setUserName(e.target.value)} value={userName} onKeyUp={handleEnterSubmit}
                    type="text" placeholder="USERNAME"className="p-2 rounded-sm bg-slate-200 font-semibold outline-none"/>
                    <button onClick={joinCreatedRoom} 
                    className="bg-green-600 w-20 p-2 rounded-sm text-white font-bold ml-auto hover:bg-green-500 ease-in duration-100">JOIN</button>
                </div>
                <p className="text-sm text-center text-white">Don't have an invite?
                <a onClick={createNewRoom} 
                className="text-blue-500 underline cursor-pointer ml-1">create new room</a></p>
            </div>
        </div>
    )
}
export default Home;