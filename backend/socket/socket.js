import {Server} from 'socket.io' ;

import http from 'http' ;
import express from 'express' ; 

 export const app = express() ; 

export const server = http.createServer(app) ; 
 export const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ['GET', 'POST','PUT','DELETE']
    }
 });

 export const getReceiverSocketId = (receiverId)  => {
    return userSocketMap[receiverId] ;  // if user is online return his socket id otherwise return null ;
 }
 const userSocketMap = {} ;

 io.on('connection', (socket) => {
    console.log('User connected',socket.id) ;
    const userId = socket.handshake.query.userId  ;
    io.emit('getOnlineUsers',Object.keys(userSocketMap));
    if(userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }
    socket.on('disconnect',() => {
        console.log('User disconnected',socket.id) ;
        delete userSocketMap[userId] ; 
         io.emit('getOnlineUsers',Object.keys(userSocketMap));

    })
});






