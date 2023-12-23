"use client";
import React from "react";
import { redirect } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { CreateRoomModal } from "@/components/CreateRoomModal";

const Home = () => {
  const session = useSession();

  if (!session || !session?.data?.user) {
    redirect("api/auth/signin");
  }

  if (session?.data?.user) {
    return (
      <div>
        <h1 className="text-red-500">Hello {session.data.user.name}</h1>
        <button onClick={signOut}>Signout</button>
        <div className="grid grid-cols-4">
          <div className="col-span-1">Chats</div>
          <div className="col-span-3">Chat detail</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={signIn}>Signout</button>
    </div>
  );
};

export default Home;
