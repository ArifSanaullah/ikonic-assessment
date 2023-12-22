"use client";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useLogin } from "./hooks/useLogin";
import { useAppDispatch } from "@/lib/hooks";
import { setIsLoggedIn, setUser } from "@/lib/userSlice";

const Login = () => {
  const methods = useForm();

  const { mutate, isLoading } = useLogin();
  console.log("🚀 ~ file: page.jsx:11 ~ Login ~ isLoading:", isLoading);

  const dispatch = useAppDispatch();

  const {
    register,
    formState: { errors },
  } = methods;
  console.log("🚀 ~ file: page.jsx:11 ~ Login ~ errors:", errors);

  const onSubmit = (data) => {
    // console.log(data);
    mutate(data, {
      onSettled: (data, err, payload, context) => {
        dispatch(setUser(data));
        dispatch(setIsLoggedIn(true));

        console.log({ data, err, payload, context });
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white flex-1 flex-col justify-center px-6 py-12 lg:px-8 text-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                })}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                })}
                className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
