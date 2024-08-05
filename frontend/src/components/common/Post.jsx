import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/TransformDate";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const postOwner = post.user;
  const queryClient = useQueryClient();

  // Fetch authenticated user
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Determine if the current user owns the post
  const isMyPost = authUser?._id === post?.user._id;

  // Check if the post is liked by the authenticated user
  const isLiked = post.likes?.includes(authUser?._id);

  const formattedDate = formatPostDate(post.createdAt) ; 

  // Delete mutation
  const { mutate: deletePost, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(`/api/post/delete/${post._id}`);
        if (res.data?.message) {
          toast.success(res.data.message);
        } else {
          throw new Error(res.error);
        }
      } catch (err) {
        toast.error(err.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  // Like/Unlike mutation
  const { mutate: likeUnlike, isLoading: isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/post/like/${post._id}`);
        if (res.data?.message) {
          toast.success(res.data.message);
          return res.data.updatedLikes;
        } else {
          throw new Error(res.error || 'Failed to like post');
        }
      } catch (err) {
        toast.error(err.message);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(['posts'], (oldData) => {
        return oldData.map((p) => p._id === post._id ? { ...p, likes: updatedLikes } : p);
      });
    }
  });


  const {mutate : CommentOne , isPending : isCommenting } = useMutation({
    mutationFn : async (text) => {
    try {
      console.log(text) ; 
      const res = await axios.post(`/api/post/comment/${post._id}`, { text  });
      if (res.data?.message) {
        toast.success(res.data.message);
        return res.data.post;
      } else {
        throw new Error(res.error || 'Failed to comment on post');
      }
    } catch (err) {
      toast.error(err.message);
    }
  },
  onSuccess : (updatedPost) => {
    queryClient.setQueryData(['posts'], (oldData) => {
      return oldData.map((p) => p._id === post._id? {...p, comments: updatedPost.comments } : p);
    });
  }
});



  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const text =comment ; 
    CommentOne(text) ; 
     

  };

  const handleLikePost = () => {
    likeUnlike();
  };

  return (
    <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
      <div className='avatar'>
        <Link to={`/profile/${post.user?.username}`} className='w-8 rounded-full overflow-hidden'>
          <img src={postOwner.profileImg || "/avatar-placeholder.png"} alt='Profile' />
        </Link>
      </div>
      <div className='flex flex-col flex-1'>
        <div className='flex gap-2 items-center'>
          <Link to={`/profile/${post.user?.username}`} className='font-bold'>
            {postOwner.fullName}
          </Link>
          <span className='text-gray-700 flex gap-1 text-sm'>
            <Link to={`/profile/${post.user?.username}`}>@{post.user?.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className='flex justify-end flex-1'>
              {isDeleting ? (
                <LoadingSpinner size="sm"/>
              ) : (
                <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
              )}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-3 overflow-hidden'>
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className='h-80 object-contain rounded-lg border border-gray-700'
              alt='Post'
            />
          )}
        </div>
        <div className='flex justify-between mt-3'>
          <div className='flex gap-4 items-center w-2/3 justify-between'>
            <div
              className='flex gap-1 items-center cursor-pointer group'
              onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
            >
              <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
              <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                {post.comments.length}
              </span>
            </div>
            {/* Comments Modal */}
            <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
              <div className='modal-box rounded border border-gray-600'>
                <h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
                <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                  {post.comments.length === 0 && (
                    <p className='text-sm text-slate-500'>
                      No comments yet 🤔 Be the first one 😉
                    </p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className='flex gap-2 items-start'>
                      <div className='avatar'>
                        <div className='w-8 rounded-full'>
                          <img
                            src={comment.user.profileImg || "/avatar-placeholder.png"}
                            alt='Commenter'
                          />
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <div className='flex items-center gap-1'>
                          <span className='font-bold'>{comment.user.username}</span>
                          <span className='text-gray-700 text-sm'>@{comment.user.username}</span>
                        </div>
                        <div className='text-sm'>{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                    {isCommenting ? (
                      <span className='loading loading-spinner loading-md'></span>
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              </div>
              <form method='dialog' className='modal-backdrop'>
                <button className='outline-none'>close</button>
              </form>
            </dialog>
            <div className='flex gap-1 items-center group cursor-pointer'>
              <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
              <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
            </div>
            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
              <FaRegHeart className={`w-4 h-4 cursor-pointer ${isLiked ? 'text-pink-500' : 'text-slate-500 group-hover:text-pink-500'}`} />
              <span className={`text-sm ${isLiked ? 'text-pink-500' : 'text-slate-500 group-hover:text-pink-500'}`}>
                {post.likes?.length}
              </span>
            </div>
          </div>
          <div className='flex w-1/3 justify-end gap-2 items-center'>
            <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
