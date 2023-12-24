"use client";
import { useAppSelector } from "@/lib/hooks";
import { Portal, Transition } from "@headlessui/react";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Fragment, useEffect } from "react";
import { useToast } from "./useToast";

const AlertTypeIcon = ({ type }) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon className="h-6 w-6 text-green-400" />;
    case "error":
      return <XCircleIcon className="h-5 w-5 text-red-600" />;
    case "warning":
      return <XCircleIcon className="h-5 w-5 text-yellow-300" />;
    default:
      return <XMarkIcon />;
  }
};

export const Toast = () => {
  const {
    isOpen: alertIsOpen,
    icon: alertType,
    message: alertMessage,
    title,
  } = useAppSelector((state) => state.toast);

  const { hideToast: closeAlert } = useToast();

  useEffect(() => {
    if (alertIsOpen) {
      const timeout = setTimeout(() => closeAlert(), 3000);

      return () => clearTimeout(timeout);
    }
  }, [alertIsOpen, closeAlert]);

  return (
    <Portal>
      <div
        aria-live="assertive"
        className="pointer-events-none z-[9000000050] fixed inset-0 flex px-4 py-6 items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={alertIsOpen}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="opacity-0 translate-x-2"
            enterTo=" opacity-100 translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={classNames(
                alertType === "error"
                  ? "border-red-400"
                  : alertType === "warning"
                  ? "border-yellow-400"
                  : "border-green-400",
                "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white border-2 shadow-lg ring-1 ring-black ring-opacity-5"
              )}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mx-2">
                    {AlertTypeIcon({ type: alertType })}
                  </div>
                  <div className="ltr:ml-3 rtl:mr-3 w-0 flex-1 ">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="mt-1 text-sm line-clamp-2 text-gray-500">
                      {alertMessage}
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={closeAlert}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Portal>
  );
};
