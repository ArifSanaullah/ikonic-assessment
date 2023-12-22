import Api from "@/Api";
import { useMutation } from "react-query";

export const useLogin = () => {
  return useMutation(Api.login);
};
