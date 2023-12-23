import { socket } from "@/lib/socket";
import { useMutation } from "react-query";

export const useCreateRoom = () => {
  return useMutation((data) => {
    socket.emit("createRoom", data);
  });
};
