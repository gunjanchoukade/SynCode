import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
// socketId : userName
const userSocketMap = {};
// roomId : code - to store current code for each room
const roomCodeMap = {};
// get all the users cconnected to a particular room
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {socketId,userName:userSocketMap[socketId]};
    }) ;
}
io.on('connection',(socket)=>{
    console.log(`User connected ${socket.id}`);

    
    socket.on("join-room",({roomId,userName})=>{
        userSocketMap[socket.id] = userName;
        socket.join(roomId);
        
        // send current room code to the new user
        if(roomCodeMap[roomId]){
            socket.emit("code-sync", {code: roomCodeMap[roomId]});
        }
        
        // whenever a user joins the room notify all the other users in the room about the new user
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit("user-connected",{
                clients,
                userName,
                socketId:socket.id   
                // socket id is of the new user who joined
            })
        })
        
    })

    // handle code changes and broadcast to all users in the room except sender
    socket.on("code-change",({roomId, code})=>{
        // update room code
        roomCodeMap[roomId] = code;
        socket.to(roomId).emit("code-change", {code});
    })

    // when a user disconnects from the server or close the page or navigate to some other page for long time
    socket.on("disconnecting",()=>{
        //which room i am in
        const rooms = [...socket.rooms];
        //console.log("rooms",rooms) rooms [ '__r8sZLsMXyoBPSAAAAH', 'gc' ] gc is the room id and the other is the socket id of the user who left
        rooms.forEach((roomId)=>{
            socket.to(roomId).emit("user-disconnected",{
                socketId : socket.id,
                userName : userSocketMap[socket.id]
            });
        })
        delete userSocketMap[socket.id];
        socket.leave(); //to leave the room
    })
})


server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})