import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from ".";
import { setOnlineUsers, setTypingUsers } from "../userSlice";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useToast } from "@/components/useToast";
import { socket } from "../socket";

export const useSocketListeners = () => {
  const session = useSession();

  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const loggedInUser = session?.data?.user ?? {};

  useEffect(() => {
    socket.on("join room", ({ room, user }) => {
      if (
        user._id !== loggedInUser?.id &&
        room.users.includes(loggedInUser?.id)
      ) {
        showToast({
          iconType: "success",
          title: "Join room",
          message: `${user.email} has join the ${room.name} room.`,
        });
      }
    });

    return () => {
      socket.off("join room");
    };
  }, [socket, loggedInUser?.id]);

  useEffect(() => {
    socket.on("leave room", ({ room, user }) => {
      if (
        user._id !== loggedInUser?.id &&
        room.users.includes(loggedInUser?.id)
      ) {
        showToast({
          iconType: "success",
          title: "Join room",
          message: `${user.email} has left the ${room.name} room.`,
        });
      }
    });

    return () => {
      socket.off("leave room");
    };
  }, [socket, loggedInUser?.id]);

  useEffect(() => {
    if (socket && loggedInUser?.id) {
      socket.emit("new user", loggedInUser?.id);
    }
  }, [loggedInUser?.id, socket]);

  useEffect(() => {
    socket?.on("get online users", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.emit("go offline", session.data.user.id);
      socket.off("get online users");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("get typing users", (typingUsers) => {
      dispatch(setTypingUsers(typingUsers));
    });

    return () => {
      socket.off("get typing users");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("new message", ({ message }) => {
      queryClient.setQueryData(
        ["fetchRoomMessages", message.roomId._id],
        (prevMsgs) => (prevMsgs ?? []).concat(message)
      );
      if (
        message.senderId._id !== loggedInUser?.id &&
        message.roomId.users.includes(loggedInUser?.id)
      ) {
        showToast({
          iconType: "success",
          message: `You have a new message in ${message.roomId.name} from ${message.senderId.email}`,
          title: "New message",
        });
      }
    });

    return () => {
      socket.off("new message");
    };
  }, [loggedInUser?.id]);
};
