import "react-chat-elements/dist/main.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useFetchRoomMessages } from "@/lib/hooks/rooms/useFetchRoomMessages";
import React, { useEffect, useRef, useState } from "react";
import { Input, MessageBox } from "react-chat-elements";
import { useSession } from "next-auth/react";
import { useLeaveRoom } from "@/lib/hooks/rooms/useLeaveRoom";
import { setRoom } from "@/lib/roomSlice";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useSendMessage } from "@/lib/hooks/message/useSendMessage";
import { useDeleteRoom } from "@/lib/hooks/rooms/useDeleteRoom";
import { useFetchJoinedRooms } from "@/lib/hooks/rooms/useFetchJoinedRooms";

export const Room = () => {
  const [msg, setMsg] = useState("");

  const { room } = useAppSelector((state) => state.room);
  const { onlineUsers } = useAppSelector((state) => state.user);

  const session = useSession();

  const otherUserId = room?.users[1];

  const currentUserId = session?.data?.user?.id;

  const isOnline = onlineUsers.map((u) => u.userId).includes(otherUserId);

  const dispatch = useAppDispatch();

  const { data = [] } = useFetchRoomMessages(room?._id);

  const { data: joinedRooms = [] } = useFetchJoinedRooms(
    session?.data?.user?.id
  );

  const { mutate, isLoading } = useLeaveRoom();

  const { mutate: deleteRoom, isLoading: deletingRoom } = useDeleteRoom();

  const msgsRef = useRef(null);

  const scrollToBottom = () => {
    msgsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [room?._id, data?.length]);

  const leaveRoom = () => {
    mutate(
      { roomId: room._id, userId: session.data.user.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["fetchJoinedRooms"]);
          queryClient.invalidateQueries(["fetchJoinableRooms"]);
          dispatch(setRoom(null));
        },
      }
    );
  };

  const { mutate: sendMessage } = useSendMessage();

  const onSend = () => {
    if (msg.trim().length > 0) {
      sendMessage(
        {
          senderId: session.data.user?.id,
          roomId: room._id,
          text: msg,
        },
        {
          onSuccess: () => setMsg(""),
        }
      );
      // may be we should send messages via socket but it's not optimized in the server yet to correctly receive messaages
      // socket.emit("messages").emit("send message", {
      //   senderId: session?.data?.user?.id,
      //   roomId: room._id,
      //   text: msg,
      // });
    }
  };

  const handleDeleteRoom = () => {
    deleteRoom(room._id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["fetchJoinedRooms"]);
        queryClient.invalidateQueries(["fetchJoinableRooms"]);
        dispatch(setRoom(joinedRooms[1] || joinedRooms[0]));
      },
    });
  };

  if (!room) {
    return <div className="w-full h-full">Please select a room</div>;
  }

  return (
    <div className="col-span-3 border h-full max-h-full rounded-md overflow-y-scroll relative flex flex-col">
      <div className="border-b p-4 bg-gray-100 w-full flex items-center justify-between z-1 self-start">
        <div>
          <h1 className="text-lg">{room?.name}</h1>
          {room.isPrivate && <span>{isOnline ? "Online" : "Offline"}</span>}
        </div>
        {room.isPrivate ? (
          <button
            className="text-sm border border-gray-700 text-gray-700 hover:bg-gray-200 rounded px-4 py-2"
            onClick={handleDeleteRoom}
            disabled={deletingRoom}
          >
            {deletingRoom ? "Deleting" : "Delete"}
          </button>
        ) : (
          <button
            className="text-sm border border-gray-700 text-gray-700 hover:bg-gray-200 rounded px-4 py-2"
            onClick={leaveRoom}
            disabled={isLoading}
          >
            {isLoading ? "Leaving" : "Leave room"}
          </button>
        )}
      </div>
      <div className="h-full flex-1 max-h-full overflow-y-scroll">
        {data.map((msg) => (
          <MessageBox
            position={
              msg.senderId._id === session.data.user.id ? "right" : "left"
            }
            type={"text"}
            text={msg.text}
            date={msg.createdAt}
            title={
              msg.senderId._id === session.data.user.id
                ? null
                : msg.senderId.email
            }
            key={msg._id}
          />
        ))}
        <div ref={msgsRef} />
      </div>
      <div className="bg-gray-100 border-t border-t-gray-300 px-4 py-2 self-end w-full">
        <Input
          className="border rounded-full overflow-hidden px-4"
          placeholder="Enter your message here"
          value={msg}
          onKeyPress={(e) => e.key === "Enter" && onSend()}
          onChange={(e) => setMsg(e.nativeEvent.target.value)}
          autofocus
          rightButtons={
            <button onClick={onSend}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          }
        />
      </div>
    </div>
  );
};
