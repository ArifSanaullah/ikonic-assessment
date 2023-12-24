import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setRoom } from "@/lib/roomSlice";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import React from "react";

export const RoomItem = ({ room }) => {
  const dispatch = useAppDispatch();

  const { room: selectedRoom } = useAppSelector((state) => state.room);

  const session = useSession();

  const onClickRoom = () => {
    dispatch(setRoom(room));
  };

  return (
    <button
      onClick={onClickRoom}
      role="list-item"
      type="button"
      className={classNames(
        "block text-left px-4 py-2 border rounded-md hover:bg-gray-100",
        room._id === selectedRoom?._id
          ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-500"
          : ""
      )}
      key={room?._id}
    >
      {!room.isPrivate
        ? room.name
        : room.createdBy._id === session.data.user?.id
        ? room.name
        : room.createdBy.email}
    </button>
  );
};
