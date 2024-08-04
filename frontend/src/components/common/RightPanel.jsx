import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import {useQuery} from '@tanstack/react-query' ;
import axios from "axios";
import toast from 'react-hot-toast'  ; 
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";
const RightPanel = () => {
	const {data:suggest , isLoading } = useQuery({
		queryKey: 'suggestedUsers',
        queryFn: async () => {
            try {
                const response = await axios.get('/api/user/suggest');
				console.log(response) ; 
                return response.data
            } catch (error) {
                console.error(error);
                return [];
            }
        },
		
	});

	console.log(suggest) ;
	const {follow , isFollowing } = useFollow() ; 

	
	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className=' bg-slate-700 p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggest?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											console.log(user._id) ;
											follow(user._id) ; 										
															
																
										}}
									>
										{isFollowing ? <LoadingSpinner size="sm"/> : "Follow"} 
 								
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;