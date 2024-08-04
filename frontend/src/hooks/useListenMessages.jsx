import React, { useEffect } from 'react'
import { useSocketContext } from './SocketContext'
import useConversation from './ConversationContext';
import notificationSound from './notification.mp3' ;
const useListenMessages = () => {
    const {socket} = useSocketContext() ; 
    const {messages , setMessages} = useConversation() ; 
    useEffect(() => {
        socket?.on("newMessage",(newMessage) => {
            newMessage.shouldShake = true ; 
            const sound = new Audio(notificationSound);
			sound.play();
            console.log("new message") ; 
            setMessages([...messages,newMessage]) ;
              
        });
        return () => {
            socket?.off("newMessage");
        }  
    },[socket,messages,setMessages])
}

export default useListenMessages
