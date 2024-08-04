import { useState } from "react";
import { useSocketContext } from "../../hooks/SocketContext";
import useConversation from "../../hooks/ConversationContext.jsx";
const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { onlineUsers } = useSocketContext();
	const {selectedConversation,setSelectedConversation} = useConversation() ; 
  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
      >
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className='w-12 rounded-full'>
            <img
              src={conversation.profileImg || "/avatar-placeholder.png"}
              alt='user avatar'
            />
          </div>
        </div>

        <div className='flex flex-col flex-1'>
          <div className='flex gap-3 justify-between'>
            <p className='font-bold text-gray-200'>{conversation.username}</p>
            <span className='text-xl'>{emoji}</span>
          </div>
        </div>
      </div>
      {lastIdx ? (
        <div className='divider my-0 py-0 h-1' />
      ) : (
        ""
      )}
    </>
  );
};

export default Conversation;
