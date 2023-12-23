import { useFetchJoinableRooms } from "@/lib/hooks/rooms/useFetchJoinableRooms";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { JoinableRoom } from "./JoinableRoom";

export const AvailableRoomsModal = () => {
  const dialogRef = useRef(null);

  const session = useSession();

  const { data } = useFetchJoinableRooms(session?.data?.user?.id);

  return (
    <div>
      <button
        onClick={() => dialogRef?.current?.showModal()}
        type="button"
        className="relative flex items-center gap-2 py-1 px-1 sm:px-4 border bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="absolute -inset-1.5" />

        <span className="text-xs whitespace-nowrap">Join a Room</span>
      </button>
      <dialog ref={dialogRef} className="rounded-md overflow-hidden">
        <div className="max-w-3xl min-w-[576px] rounded-md flex flex-col gap-4 p-4">
          <button
            className="ml-auto block"
            onClick={() => dialogRef?.current?.close()}
          >
            Close
          </button>
          {data.map((room) => (
            <JoinableRoom
              key={room._id}
              room={room}
              onJoinSuccess={() => dialogRef?.current?.close()}
            />
          ))}
        </div>
      </dialog>
    </div>
  );
};
