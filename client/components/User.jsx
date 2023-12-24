import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCreateRoom } from "@/lib/hooks/rooms/useCreateRoom";
import { setRoom } from "@/lib/roomSlice";
import { useSession } from "next-auth/react";
import React from "react";

export const User = ({ user, onSuccess }) => {
  const dispatch = useAppDispatch();

  const { mutate } = useCreateRoom();

  const { onlineUsers } = useAppSelector((state) => state.user);

  const isOnline = onlineUsers.some((u) => u.userId === user._id);

  const session = useSession();

  const createRoom = (user) => {
    mutate(
      {
        users: [session.data.user.id, user._id],
        name: user.email,
        createdBy: session.data.user.id,
        isPrivate: true,
      },
      {
        onSuccess: (res) => {
          dispatch(setRoom(res.room));
          onSuccess(res);
        },
      }
    );
  };

  return (
    <div className="border p-4 rounded flex items-center justify-between">
      <div>
        <p>{user.email}</p>
        {isOnline && <span className="text-xs text-indigo-500">Online</span>}
      </div>
      <button
        className="bg-indigo-500 px-4 py-2 rounded text-white hover:bg-indigo-600"
        onClick={() => createRoom(user)}
      >
        Send a message
      </button>
    </div>
  );
};
