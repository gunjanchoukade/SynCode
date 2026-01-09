import { use, useContext, useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom"
import Collabs from "../components/Collabs";
import Editor from "@monaco-editor/react";
import { context } from "../../context/SocketContext";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const EditorPage = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();

    const {socketRef} = useContext(context);

    const [collaborators, setCollaborators] = useState([]);
    const [code, setCode] = useState("// Happy Javascript");
    const editorRef = useRef(null);

    useEffect(()=>{
        if(!state?.userName){
            toast.error("Username is required");
            navigate("/");
            return;
        }
        socketRef.current.on("connect_error",(err)=>{handleErrors(err)}); 
        socketRef.current.on("connect_failed",(err)=>{handleErrors(err)});

        function handleErrors(e){
            console.log("Socket connection error", e);
            toast.error("Socket connection error, try again later.");
            navigate("/");
        }

        // joining the room
        socketRef.current.emit("join-room",{roomId,userName:state?.userName});

        //listening for new user joined
        socketRef.current.on("user-connected",({clients,userName,socketId})=>{
            if(userName !== state?.userName){
                toast.success(`${userName} joined the room.`);
            }
            setCollaborators(clients);
        })

        // listening for user disconnected
        socketRef.current.on("user-disconnected",({socketId,userName})=>{
            toast.success(`${userName} left the room.`);
            setCollaborators((prev)=>{
                return prev.filter((col)=> col.socketId !== socketId)
            });
        })

        // listening for initial code sync when joining room
        socketRef.current.on("code-sync",({code})=>{
            if(code !== null){
                setCode(code);
            }
        })

        // listening for code changes from other users
        socketRef.current.on("code-change",({code})=>{
            if(code !== null){
                setCode(code);
            }
        })

        return ()=>{
            socketRef.current.off("user-connected");
            socketRef.current.off("user-disconnected");
            socketRef.current.off("code-sync");
            socketRef.current.off("code-change");
            socketRef.current.disconnect();
        }
    },[]);

    const copyRoomId = async () =>{
        navigator.clipboard.writeText(roomId);
        toast.success("Room ID copied to clipboard");
    }

    const leaveRoom = () => {
        navigate("/");

    }
   

    return(
        <div className="h-screen flex">
            {/* left sidebar */}
            <div className="bg-[#1C1B27] h-full w-[20%] p-3 flex flex-col">
                {/* header */}
                <div className="flex gap-3 items-center mb-3">
                    <div>
                        <img className="w-12 rounded-lg" 
                        src="/download.png" alt="SynCode Logo" />
                    </div>
                    <div className="w-[2px] h-[50px] bg-orange-400 rounded-lg"></div>
                    <div className="text-white">
                        <h1 className="text-lg font-bold">SynCode</h1>
                        <p className="text-xs opacity-70">Code together in real-time</p>
                    </div>
                </div>
                {/* body middle */}
                <div>
                    <h3 className="text-white italic font-semibold mb-3">Collaborators:</h3> 
                    <div className="overflow-y-auto h-[70vh] pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {collaborators.map((col, index) => {
                            return <Collabs key={index} userName={col.userName}></Collabs>
                        })}
                    </div>
                </div>
                {/* footer buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button onClick={copyRoomId} 
                    className="font-bold bg-blue-600 hover:bg-blue-500 ease-in-out duration-200 text-white rounded-md p-2">Copy RoomId</button>
                    <button onClick={leaveRoom} 
                    className="font-bold bg-red-600 hover:bg-red-500 ease-in-out duration-200 text-white rounded-md p-2">Leave</button>
                </div>
            </div>

            {/* right side whole */}
            <div className="bg-[#232532] w-[80%]">
                <Editor className="p-2"
                    defaultLanguage="javascript"
                    height="100vh"
                    theme="vs-dark"
                    value={code}
                    onMount={(editor) => {
                        editorRef.current = editor;
                    }}
                    // value internally provided by monaco editor to detect change 
                    onChange={(value) => {
                        if(value !== code){
                            setCode(value);
                            socketRef.current.emit("code-change", {
                                roomId,
                                code: value
                            });
                        }
                    }}
                />
            </div>
        </div>
    )
}
// editor value is Hello js using controlled component when value on editor chanegs the onChange event is triggered
// and we set the new value to code state and emit the code-change event to server with new code
// when we receive code-change event from server we set the code state to new code which updates the editor value
// but since the value is same as previous value the onChange event is not triggered again preventing infinite loop
// of events.
// this is how we achieve real-time code collaboration
export default EditorPage