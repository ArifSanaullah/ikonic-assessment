import "react-chat-elements/dist/main.css";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useFetchRoomMessages } from "@/lib/hooks/rooms/useFetchRoomMessages";
import React from "react";
import { MessageBox } from "react-chat-elements";
import { useSession } from "next-auth/react";
import { useLeaveRoom } from "@/lib/hooks/rooms/useLeaveRoom";
import { setRoom } from "@/lib/roomSlice";
import { queryClient } from "@/providers/ReactQueryProvider";

export const Room = () => {
  const { room } = useAppSelector((state) => state.room);

  const dispatch = useAppDispatch();

  const session = useSession();

  const { data = [] } = useFetchRoomMessages(room?._id);

  const { mutate, isLoading } = useLeaveRoom();

  const leaveRoom = () => {
    mutate(
      { roomId: room._id, userId: session.data.user.id },
      {
        onSuccess: (res) => {
          console.log("🚀 ~ file: Room.jsx:28 ~ leaveRoom ~ res:", res);
          queryClient.invalidateQueries(["fetchJoinedRooms"]);
          queryClient.invalidateQueries(["fetchJoinableRooms"]);
          dispatch(setRoom(null));
        },
      }
    );
  };

  if (!room) {
    return <div className="w-full h-full">Please select a room</div>;
  }

  return (
    <div className="col-span-3 border h-full max-h-full rounded-md overflow-y-scroll relative">
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
      {data.map((msg) => (
        <MessageBox
          position={msg.senderId === session.data.user.id ? "right" : "left"}
          type={"text"}
          text={msg.text}
          key={msg._id}
        />
      ))}
    </div>
  );
};
