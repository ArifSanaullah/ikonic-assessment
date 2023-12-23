import { useAppDispatch } from "@/lib/hooks";
import { useJoinRoom } from "@/lib/hooks/rooms/useJoinRoom";
import { setRoom } from "@/lib/roomSlice";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useSession } from "next-auth/react";
import React from "react";

export const JoinableRoom = ({ room, onJoinSuccess }) => {
  const { mutate, isLoading } = useJoinRoom();

  const session = useSession();

  const dispatch = useAppDispatch();

  const joinRoom = () => {
    mutate(
      { roomId: room._id, userId: session.data.user.id },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries(["fetchJoinedRooms"]);
          queryClient.invalidateQueries(["fetchJoinableRooms"]);
          dispatch(setRoom(res));
          onJoinSuccess?.();
        },
      }
    );
  };

  return (
    <div
      className="p-4 border rounded flex items-center justify-between"
      key={room.id}
    >
      <p>{room.name}</p>
      <button
        className=" rounded px-4 py-2 text-white bg-indigo-500 hover:bg-indigo-600"
        onClick={joinRoom}
        disabled={isLoading}
      >
        {isLoading ? "Joining" : "Join"}
      </button>
    </div>
  );
};
