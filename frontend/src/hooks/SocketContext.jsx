import { createContext, useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useQuery } from '@tanstack/react-query';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  useEffect(() => {
    if (authUser) {
      const newSocket = io("https://mistysocial.onrender.com", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(newSocket);

      newSocket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
