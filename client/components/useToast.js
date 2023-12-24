import { useAppDispatch } from "@/lib/hooks";
import { hideToast, showToast } from "@/lib/toastSlice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const handleShowToast = ({
    iconType = "success",
    message = "Success",
    title = "Alert",
  }) => dispatch(showToast({ icon: iconType, message, title }));

  const handleHideToast = () => dispatch(hideToast());

  return { showToast: handleShowToast, hideToast: handleHideToast };
};
