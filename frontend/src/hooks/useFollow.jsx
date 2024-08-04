import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending: isFollowing } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await axios.get(`/api/user/user/${userId}`);
                if (res.data?.message) {
                    toast.success(res.data.message);
                } else {
                    throw new Error(res.error || 'Failed to follow user');
                }
            } catch (error) {
                toast.error(error.message || 'An error occurred');
                console.error('Follow Error:', error);
            }
        },
        onSuccess: () => {
            Promise.all([
            queryClient.invalidateQueries('authUser'),
            queryClient.invalidateQueries('suggestedUsers')
            ])
            
        },
    });

    return { follow, isFollowing };
};

export default useFollow;
