"use client";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchJoinedRooms } from "@/lib/hooks/rooms/useFetchJoinedRooms";
import { RoomItem } from "@/components/RoomItem";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Room } from "@/components/Room";
import { socket } from "@/lib/socket";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useToast } from "@/components/useToast";
import { setOnlineUsers, setTypingUsers } from "@/lib/userSlice";

const Home = () => {
  const session = useSession();

  const { data = [], isLoading } = useFetchJoinedRooms(session?.data?.user?.id);

  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const user = session?.data?.user;

  useEffect(() => {
    if (socket && session?.data?.user?.id) {
      socket.emit("new user", session?.data?.user?.id);
    }
  }, [session?.data?.user?.id, socket]);

  useEffect(() => {
    socket?.on("get online users", (users) => {
      console.log("🚀 ~ file: page.jsx:33 ~ socket?.on ~ users:", users);
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
        message.senderId._id !== user?.id &&
        message.roomId.users.includes(user?.id)
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
  }, [user?.id]);

  if (!session || !session?.data?.user) {
    redirect("api/auth/signin");
  }

  if (isLoading) {
    return <p>Loading...!!!</p>;
  }

  if (session?.data?.user) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4 max-h-full h-[calc(100vh_-_64px)] border">
        <div className="col-span-1 flex flex-col gap-2">
          <h1>Available rooms</h1>
          {data.map((room) => (
            <RoomItem room={room} key={room._id} />
          ))}
        </div>
        <Room />
      </div>
    );
  }

  return (
    <div>
      <h1>You're not signed in</h1>
    </div>
  );
};

export default Home;
