import Api from "@/Api";
import { useQuery } from "react-query";

export const useFetchJoinableRooms = (userId) => {
  const query = useQuery(
    ["fetchJoinableRooms", userId],
    async () => {
      if (!userId) {
        return [];
      }

      return Api.getJoinableRooms(userId);
    },
    { initialData: [] }
  );

  return query;
};
