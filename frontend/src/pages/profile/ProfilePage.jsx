import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { FaArrowLeft } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatMemberSinceDate } from "../../utils/TransformDate";
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { data: user, isLoading, refetch, isRefetching, isError } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await axios.get(`/api/user/profile/${username}`);
      return res.data.success;
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to load profile");
    },
  });

  const memberSince = formatMemberSinceDate(user?.createdAt);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (state === "coverImg") setCoverImg(reader.result);
        if (state === "profileImg") setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isMyProfile = authUser?._id === user?._id;

  const { follow, isFollowing } = useFollow();
  const isFollowed = user?.followers.includes(authUser?._id);

  const queryClient = useQueryClient();

  const { mutate: update, isLoading: isUpdating } = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/user/update', { profileImg, coverImg });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(['userProfile']);
      queryClient.invalidateQueries(['authUser']);
      queryClient.invalidateQueries(['suggestedUsers']);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {isError && <p className="text-center text-lg mt-4">Error loading profile</p>}
      {!isLoading && !user && !isError && (
        <p className="text-center text-lg mt-4">User not found</p>
      )}
      {!isLoading && !isRefetching && user && (
        <>
          <ProfileHeader
            user={user}
            authUser={authUser}
            isMyProfile={isMyProfile}
            follow={follow}
            isFollowing={isFollowing}
            isFollowed={isFollowed}
            handleImgChange={handleImgChange}
            coverImgRef={coverImgRef}
            profileImgRef={profileImgRef}
            coverImg={coverImg}
            profileImg={profileImg}
            update={update}
            isUpdating={isUpdating}
            memberSince={memberSince}
            feedType={feedType}
            setFeedType={setFeedType}
          />
        </>
      )}
      <Posts type={feedType} username={username} userId={user?._id} />
    </div>
  );
};

const ProfileHeader = ({
  user,
  authUser,
  isMyProfile,
  follow,
  isFollowing,
  isFollowed,
  handleImgChange,
  coverImgRef,
  profileImgRef,
  coverImg,
  profileImg,
  update,
  isUpdating,
  memberSince,
  feedType,
  setFeedType,
}) => {
  return (
    <>
      <div className="flex gap-10 px-4 py-2 items-center">
        <Link to="/">
          <FaArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex flex-col">
          <p className="font-bold text-lg">{user?.fullName}</p>
          <span className="text-sm text-slate-500">{user?.posts?.length || 0} posts</span>
        </div>
      </div>
      <div className="relative group/cover">
        <img
          src={coverImg || user?.coverImg || "/cover.png"}
          className="h-52 w-full object-cover"
          alt="cover"
        />
        {isMyProfile && (
          <div
            className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
            onClick={() => coverImgRef.current.click()}
            aria-label="Edit cover image"
          >
            <MdEdit className="w-5 h-5 text-white" />
          </div>
        )}
        <input
          type="file"
          hidden
          ref={coverImgRef}
          onChange={(e) => handleImgChange(e, "coverImg")}
        />
        <input
          type="file"
          hidden
          ref={profileImgRef}
          onChange={(e) => handleImgChange(e, "profileImg")}
        />
        <div className="avatar absolute -bottom-16 left-4">
          <div className="w-32 rounded-full relative group/avatar">
            <img
              src={profileImg || user?.profileImg || "/avatar-placeholder.png"}
              alt="profile"
            />
            {isMyProfile && (
              <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                <MdEdit
                  className="w-4 h-4 text-white"
                  onClick={() => profileImgRef.current.click()}
                  aria-label="Edit profile image"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end px-4 mt-5">
        {isMyProfile && <EditProfileModal user={authUser} />}
        {!isMyProfile && (
          <button
            className="btn btn-outline rounded-full btn-sm"
            onClick={() => follow(user._id)}
            aria-label={isFollowed ? "Unfollow user" : "Follow user"}
          >
            {isFollowing ? <LoadingSpinner size="lg" /> : isFollowed ? "Unfollow" : "Follow"}
          </button>
        )}
        {(coverImg || profileImg) && (
          <button
            className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
            onClick={update}
            aria-label="Update profile images"
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingSpinner size="lg" /> : "Update"}
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-14 px-4">
        <div className="flex flex-col">
          <span className="font-bold text-lg">{user?.fullName}</span>
          <span className="text-sm text-slate-500">@{user?.username}</span>
          <span className="text-sm my-1">{user?.bio}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user?.link && (
            <div className="flex gap-1 items-center">
              <FaLink className="w-3 h-3 text-slate-500" />
              <a
                href={user.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {user.link}
              </a>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <IoCalendarOutline className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-500">{memberSince}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 items-center">
            <span className="font-bold text-xs">{user?.following.length}</span>
            <span className="text-slate-500 text-xs">Following</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="font-bold text-xs">{user?.followers.length}</span>
            <span className="text-slate-500 text-xs">Followers</span>
          </div>
        </div>
      </div>
      <div className="flex w-full border-b border-gray-700 mt-4">
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${feedType === "posts" ? "text-white" : "text-slate-500"}`}
          onClick={() => setFeedType("posts")}
        >
          Posts
          {feedType === "posts" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
        <div
          className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${feedType === "likes" ? "text-white" : "text-slate-500"}`}
          onClick={() => setFeedType("likes")}
        >
          Likes
          {feedType === "likes" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
