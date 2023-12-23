"use client";
import { useRef } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useCreateRoom } from "@/lib/hooks/rooms/useCreateRoom";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "@/lib/hooks";
import { setRoom } from "@/lib/roomSlice";

export const RoomsModal = () => {
  const dialogRef = useRef(null);

  const methods = useForm({ shouldUnregister: false });

  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
    reset,
  } = methods;

  const session = useSession();

  const { mutate, isLoading } = useCreateRoom();

  const onSubmit = (data) => {
    if (session?.data?.user) {
      mutate(
        {
          ...data,
          users: [session.data.user.id],
          createdBy: session.data.user.id,
        },
        {
          onSuccess: (data) => {
            dispatch(setRoom(data.room));
            dialogRef?.current?.close();
            reset();
          },
        }
      );
    }
  };

  return (
    <div>
      <button
        onClick={() => dialogRef?.current?.showModal()}
        type="button"
        className="relative flex items-center gap-2 py-1 px-1 sm:px-4 border bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="absolute -inset-1.5" />
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:block whitespace-nowrap">Create Room</span>
      </button>
      <dialog ref={dialogRef} className="rounded-md">
        <form
          className="max-w-3xl min-w-[576px]"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="p-4">
            <div className="flex flex-col gap-2">
              {session?.data?.user?.id}
              <label htmlFor="name" className="text-gray-900 text-xs">
                Room Name:
              </label>
              <input
                type="text"
                id="name"
                className="border border-gray-200 rounded px-2 py-1 focus:border-indigo-500"
                {...register("name", {
                  required: { value: true, message: "Room name is required" },
                })}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="border-b" />
          <div className="p-4 flex items-center justify-end gap-x-4">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => dialogRef?.current?.close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Loading" : "Save"}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};
