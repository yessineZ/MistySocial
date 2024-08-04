import {create} from 'zustand' ; 


const useConversation = create((set) => ({
    selectedConversation : null , 
    setSelectedConversation : (selectedConversation) => set({selectedConversation: selectedConversation}) ,
    messages : [] ,
    setMessages : (messages) => set({messages: messages}) ,

}));

export default useConversation ;