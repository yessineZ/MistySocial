import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/auth/home/HomePage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import Sidebar from './components/SideBar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './components/common/LoadingSpinner';
import AllMessagesPage from './pages/messages/AllMessagesPage';

const fetchAuthUser = async () => {
  try {
    const res = await axios.get('/api/auth/getMe',{
      withCredentials: true
    });
    console.log(res) ; 
    return res.data?.user || null;
  } catch (err) {
    throw new Error(err.message);
  }
};

function App() {
  const { data: authUser, isLoading, isError, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchAuthUser,
    onError: (err) => toast.error(err.message),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={<Navigate to={authUser ? '/home' : '/login'} />} />
        <Route path='/home' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/home' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/home' />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        <Route path='/messages' element={authUser ? <AllMessagesPage /> : <Navigate to='/login' />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
}

export default App;
