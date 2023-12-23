import Api from "@/Api";
import { useMutation } from "react-query";

export const useJoinRoom = () => {
  return useMutation(Api.joinRoom);
};
