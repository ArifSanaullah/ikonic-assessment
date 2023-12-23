import "react-chat-elements/dist/main.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useFetchRoomMessages } from "@/lib/hooks/rooms/useFetchRoomMessages";
import React, { useState } from "react";
import { Input, MessageBox } from "react-chat-elements";
import { useSession } from "next-auth/react";
import { useLeaveRoom } from "@/lib/hooks/rooms/useLeaveRoom";
import { setRoom } from "@/lib/roomSlice";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useSendMessage } from "@/lib/hooks/message/useSendMessage";

export const Room = () => {
  const [msg, setMsg] = useState("");

  const { room } = useAppSelector((state) => state.room);

  const dispatch = useAppDispatch();

  const session = useSession();

  const { data = [] } = useFetchRoomMessages(room?._id);

  const { mutate, isLoading } = useLeaveRoom();

  const leaveRoom = () => {
    if (msg.trim()) {
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
    }
  };

  const { mutate: sendMessage } = useSendMessage();

  const onSend = () => {
    sendMessage(
      {
        senderId: session.data.user?.id,
        roomId: room._id,
        text: msg,
      },
      { onSuccess: () => setMsg("") }
    );
  };

  if (!room) {
    return <div className="w-full h-full">Please select a room</div>;
  }

  return (
    <div className="col-span-3 border h-full max-h-full rounded-md overflow-y-scroll relative flex flex-col">
      <div className="border-b p-4 bg-gray-100 sticky top-0 flex items-center justify-between">
        <h1 className="text-lg">{room?.name}</h1>
        <button
          className="text-sm border border-gray-700 text-gray-700 hover:bg-gray-200 rounded px-4 py-2"
          onClick={leaveRoom}
          disabled={isLoading}
        >
          {isLoading ? "Leaving" : "Leave room"}
        </button>
      </div>
      <div className="h-full flex-1">
        {data.map((msg) => (
          <MessageBox
            position={
              msg.senderId._id === session.data.user.id ? "right" : "left"
            }
            type={"text"}
            text={msg.text}
            key={msg._id}
          />
        ))}
      </div>
      <div className="bg-gray-100 border-t border-t-gray-300 px-4 py-2">
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
