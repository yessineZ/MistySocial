import { useState } from "react";
import { BsSend } from "react-icons/bs";
import {useMutation} from '@tanstack/react-query' ; 
import useConversation from "../../hooks/ConversationContext";
import { toast } from "react-hot-toast";
import axios from 'axios' ; 

const MessageInput = () => {
    const {messages,setMessages,selectedConversation} = useConversation()  ; 
	const [message,setMessage] = useState("") ;  
    const {mutate : Sendmessage , isPending : loading , isError , error} = useMutation({
        mutationFn: async (message) => {
            try {
                const res = await axios.post(`/api/messages/send/${selectedConversation._id}`, { message });
                setMessages([...messages,res.data.message]) ;
				return res.data;
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        },
        onError: (error) => {
            console.error(error);
        },
    })


	const handleSubmit = async (e) => {
        e.preventDefault();
		if(message === "") return ;
	 await Sendmessage(message) ;
	    setMessage("") ;
        
    };
	return (
		<form onSubmit={handleSubmit} className='px-4 my-3'>
			<div className='w-full relative'>
				<input value={message} onChange={(e) => setMessage(e.target.value) }
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
				/>
				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					{!loading ? <BsSend /> : <span className="loading loading-spinner"></span> }
				</button>
			</div>
		</form>
	);
};
export default MessageInput;








