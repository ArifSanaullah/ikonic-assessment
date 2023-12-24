import Api from "@/Api";
import { useQuery } from "react-query";

export const useFetchUsers = () => {
  return useQuery(["fetchUsers"], Api.fetchUsers);
};
