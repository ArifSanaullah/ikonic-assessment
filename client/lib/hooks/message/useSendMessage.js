import Api from "@/Api";
import { useMutation } from "react-query";

export const useSendMessage = () => useMutation(Api.sendMessage);
