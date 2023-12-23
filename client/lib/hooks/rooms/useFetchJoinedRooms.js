import Api from "@/Api";
import { useQuery } from "react-query";

export const useFetchJoinedRooms = (userId) => {
  const query = useQuery(
    ["fetchJoinedRooms", userId],
    async () => {
      if (!userId) {
        return [];
      }

      return Api.getJoinedRooms(userId);
    },
    { initialData: [] }
  );

  return query;
};
