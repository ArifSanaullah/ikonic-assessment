import Api from "@/Api";
import { useMutation } from "react-query";

export const useLeaveRoom = () => {
  return useMutation(Api.leaveRoom);
};
