import React, { useEffect , useRef} from 'react'
import Message from './Message'
import  useListenMessages  from '../../hooks/useListenMessages';
import useConversation from '../../hooks/ConversationContext' ; 
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import MessageSkeleton from './MessageSkeleton';
const Messages = () => {
   
    const [loading,setLoading] = useState(false) ; 
    const {messages,setMessages,selectedConversation} = useConversation() ; 

    
    useEffect(() => {
        const getMessages = async () => {
            setLoading(true) ;
            try {
                const res = await axios.get(`/api/messages/${selectedConversation._id}`,{
                  withCredentials: true
                }) ;
                console.log(res.data)
                setMessages(res.data.conversation) ;
                console.log(messages) ; 
            } catch (error) {
                toast.error(error.message) ;
                console.error(error) ;
            }
            setLoading(false) ;
        }
        if(selectedConversation?._id) getMessages() ;
    },[selectedConversation._id,setMessages]);

  let lastMessage =useRef() ; 
  useListenMessages() ; 

  setTimeout(() => {
    lastMessage.current?.scrollIntoView({ behavior: 'smooth' }) ;  // scroll to the bottom of the messages container when new messages arrive
  },50);

  return (
    <div className='px-4 flex-1 overflow-auto '>
       {!loading &&
				messages?.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessage}>
                        
						<Message message={message} />
					</div>
				))}
       {loading && [...Array(3)].map((_,idx) =><MessageSkeleton key={idx} />)} 
      {!loading && !messages && (
        <p className='text-center text-gray-300'>Send a message to start the conversation...</p>
      )}

    </div>
  )
      }


export default Messages









