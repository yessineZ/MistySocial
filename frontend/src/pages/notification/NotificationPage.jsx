import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdHeartDislike } from "react-icons/io";
import { FaComment } from "react-icons/fa";
import { SlUserUnfollow } from "react-icons/sl";

import { toast } from "react-hot-toast";
import axios from 'axios'; 
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'; 

import { formatPostDate } from "../../utils/TransformDate";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/notifications");
        return response.data;
      } catch (err) {
        console.log(err.message);
        toast.error("Failed to fetch notifications. Please try again later.");
      }
    },
  });


  

  const { mutate: deleteNoti, isPending } = useMutation({
    mutationFn: async () => {
      try {
        await axios.delete(`/api/notifications`);
        toast.success("All notifications deleted successfully");
      } catch (err) {
        console.log(err.message);
        toast.error("Failed to delete notifications. Please try again later.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => {
      console.log(err.message);
      toast.error("Failed to delete notifications. Please try again later.");
    },
  });

  const deleteNotifications = () => {
    deleteNoti();
  };

  return (
    <>
      <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
          <p className='font-bold'>Notifications</p>
          <div className='dropdown'>
            <div tabIndex={0} role='button' className='m-1'>
              <IoSettingsOutline className='w-4' />
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a onClick={deleteNotifications}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className='flex justify-center h-full items-center'>
            <LoadingSpinner size='lg' />
          </div>
        )}
        {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
        {notifications?.map((notification) => (
          <div className='border-b border-gray-700' key={notification._id}>
            <div className='flex gap-2 p-4'>
              {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
              {notification.type === "unfollow" && <SlUserUnfollow className='w-7 h-7 text-red-700' />}
              {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
              {notification.type === "unlike" && <IoMdHeartDislike className='w-7 h-7 text-red-700' />}
              {notification.type === "comment" && <FaComment className='w-7 h-7 text-slate-600' />}
              <Link to={`/profile/${notification.from.username}`}>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className='flex gap-1'>
                  <span className='font-bold text-red-500'>@{notification.from.username}</span>{" "}
                  {notification.type === "follow" ? "followed you" : notification.type === "unlike" ? "disliked your post xd" : notification.type === "comment" ? "commented to your post" : notification.type === "unfollow" ? "ahahah na7alek el follow" : "liked your post"}
                </div>
              </Link>
              <div className=" relative top-0 right-0">
                <span className="text-primary">{
                 formatPostDate(notification.createAt)
                }</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
