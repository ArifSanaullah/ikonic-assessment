import Api from "@/Api";
import { useQuery } from "react-query";

export const useFetchRoomMessages = (roomId) => {
  return useQuery(
    ["fetchRoomMessages", roomId],
    () => {
      if (!roomId) {
        return;
      }

      return Api.getRoomMessages(roomId);
    },
    { refetchOnMount: false }
  );
};
