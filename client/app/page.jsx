"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useFetchJoinedRooms } from "@/lib/hooks/rooms/useFetchJoinedRooms";
import { RoomItem } from "@/components/RoomItem";
import { Room } from "@/components/Room";
import { useSocketListeners } from "@/lib/hooks/useSocketListeners";

const Home = () => {
  const session = useSession();

  const { data = [], isLoading } = useFetchJoinedRooms(session?.data?.user?.id);

  useSocketListeners();

  if (!session || !session?.data?.user) {
    redirect("api/auth/signin");
  }

  const sendNoti = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      // console.log(
      //   "🚀 ~ file: page.jsx:38 ~ sendNoti ~ otification.permission:",
      //   Notification.permission
      // );
      // console.log("Granted");
      new Notification("Test", { body: "This is body" });
    }
  };

  if (isLoading) {
    return <p>Loading...!!!</p>;
  }

  if (session?.data?.user) {
    return (
      <div className="grid grid-cols-4 gap-4 p-4 max-h-full h-[calc(100vh_-_64px)] border">
        <div className="col-span-1 flex flex-col gap-2">
          <button onClick={sendNoti}>Send noti</button>
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
