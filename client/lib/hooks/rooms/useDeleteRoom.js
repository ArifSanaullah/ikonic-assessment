import Api from "@/Api";
import { useMutation } from "react-query";

export const useDeleteRoom = () => useMutation(Api.deleteRoom);
