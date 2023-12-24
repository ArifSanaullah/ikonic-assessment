import { useFetchJoinedRooms } from "@/lib/hooks/rooms/useFetchJoinedRooms";
import { useFetchUsers } from "@/lib/hooks/users/useFetchUsers";
import { useSession } from "next-auth/react";
import React, { useRef } from "react";
import { User } from "./User";

export const UsersModal = () => {
  const dialogRef = useRef(null);

  const { data = [] } = useFetchUsers();

  const session = useSession();

  const { data: joinedRooms = [] } = useFetchJoinedRooms(
    session?.data?.user?.id
  );

  const users = data.filter((u) => {
    return (
      u._id !== session.data.user?.id &&
      !joinedRooms.some((room) => room.isPrivate && room.users.includes(u._id))
    );
  });

  return (
    <div>
      <button
        onClick={() => dialogRef?.current?.showModal()}
        type="button"
        className="relative flex items-center gap-2 py-1 px-1 sm:px-4 border bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="absolute -inset-1.5" />
        <span className="hidden sm:block whitespace-nowrap text-xs">Users</span>
      </button>
      <dialog ref={dialogRef} className="rounded-md">
        <div className="max-w-3xl min-w-[576px] rounded-md flex flex-col gap-4 p-4">
          <button
            className="ml-auto block"
            onClick={() => dialogRef?.current?.close()}
          >
            Close
          </button>
          {users.map((user) => (
            <User
              user={user}
              onSuccess={() => dialogRef.current?.close()}
              key={user._id}
            />
          ))}
        </div>
      </dialog>
    </div>
  );
};
