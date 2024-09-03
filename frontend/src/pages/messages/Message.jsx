import { formatPostDate } from '../../utils/TransformDate'  ; 
import {useQuery} from '@tanstack/react-query' ; 
import selectedConversation from '../Conversations/Conversation' ;

const Message = ({ message }) => {
	const {data :  authUser , isPending : loading , isError , error  } = useQuery({queryKey : ['authUser']}) ; 
	const {senderId , receiverId} = message ; 
	const fromMe = senderId === authUser._id; 
	const formattedTime = formatPostDate(message.createdAt);
<<<<<<< HEAD
	const myPic = authUser?.profieImg ?  authUser.profieImg : '../../../dist/avatar-placeholder.png' ; 
	const hisPic = selectedConversation?.profileImg ? selectedConversation.profileImg : '../../../dist/avatar-placeholder.png' ; 
	console.log(selectedConversation) ; 
=======
	const myPic = authUser?.profileImg ?  authUser.profileImg : '/avatars/boy1.png' ; 
	const hisPic = selectedConversation?.profileImg ? selectedConversation.profileImg : '/avatars/boy2.png' ; 
	
>>>>>>> 1bebb8de41145abeb16453169658e13016d75324
	const profilePic = fromMe ? myPic : hisPic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const shakeClass = message.shouldShake ? "shake" : "";
	 
	return (
		<div className={`chat ${fromMe ? "chat-end" : "chat-start"} `}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
