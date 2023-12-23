"use client";
import React from "react";
import { redirect } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { CreateRoomDialog } from "@/lib/components/CreateRoomModal";

const Home = () => {
  const session = useSession();

  if (!session || !session?.data?.user) {
    redirect("api/auth/signin");
  }

  if (session?.data?.user) {
    return (
      <div>
        <CreateRoomDialog />
        <h1>Hello {session.data.user.name}</h1>
        <button onClick={signOut}>Signout</button>
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
