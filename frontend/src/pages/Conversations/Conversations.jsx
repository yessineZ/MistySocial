
import { getRandomEmoji } from "../../utils/emojis"; 
import Conversation from "./Conversation";
import {useQuery} from '@tanstack/react-query' ; 
import axios from 'axios' ; 

const Conversations = () => {
	const {data : conversations , isPending : loading , isError , error} = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/user/messages'); 
                return response.data.following;
            } catch (error) {
                console.error(error);
            }
        },
        retry: false,
    }) 
	return (
		<div className='py-2 flex flex-col overflow-auto'>
            {conversations?.length === 0 ? "Follow friends to get Conversations" : null} ;  
			{conversations?.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;
