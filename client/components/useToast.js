import { useAppDispatch } from "@/lib/hooks";
import { hideToast, showToast } from "@/lib/toastSlice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const handleShowToast = ({
    iconType = "success",
    message = "Success",
    title = "Alert",
  }) => {
    if ("Notification" in window && Notification.permission === "granted") {
      console.log("Sending notification to device");
      new Notification(title, { body: message });
    }
    dispatch(showToast({ icon: iconType, message, title }));
  };

  const handleHideToast = () => dispatch(hideToast());

  return { showToast: handleShowToast, hideToast: handleHideToast };
};
