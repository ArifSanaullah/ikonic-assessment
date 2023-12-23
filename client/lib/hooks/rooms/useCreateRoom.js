import Api from "@/Api";
import { queryClient } from "@/providers/ReactQueryProvider";
import { useMutation } from "react-query";

export const useCreateRoom = () =>
  useMutation(Api.createRoom, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchJoinedRooms"]);
    },
  });
