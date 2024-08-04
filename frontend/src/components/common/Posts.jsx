import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useQuery } from '@tanstack/react-query' ; 
import axios from "axios";
import { useEffect } from "react";
const Posts = ({type,username,userId}) => {


	const getTypeOfPosts = () => {
		switch(type) {
			case 'forYou' : 
			return '/api/post/all' ; 
			case 'following' : 
			return '/api/post/following' ;
			case 'posts' : 
			return `/api/post/all/${username}` ;  
			case 'likes' : 
			return `/api/post/likedPosts/${userId}` ;  ;  // userId is the logged in user's id.  ;  // userId is the logged in user's id.  ;  // userId is the logged in user's id.   ;  // userId is the logged in user's id.   ;  // userId is the logged in user's id.   ;  // userId is the logged in user's id.   ;  // userId is the logged
			default :  
			return '/api/post/all' ;
		}
	
	
	}
	const { data : POSTS , isLoading , isError, error ,refetch ,isRefetching } = useQuery({
		queryKey: ['posts'],
        queryFn: async () => {
			try {
				
const res = await axios.get(getTypeOfPosts());
console.log(res) ; 
            return res.data;
			}
			catch(err) {
                console.error(err);
                toast.error("Failed to fetch posts. Please try again later.");
                return [];
            }
            
        },
        
	}) 
	console.log(POSTS);

	useEffect(()=> {
		refetch() ; 
	},[type,refetch,username]);


	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;