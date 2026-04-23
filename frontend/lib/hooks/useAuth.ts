import { useMutation } from "@tanstack/react-query";
import { register, login } from "../apis/authApi";
import {
  authData,
  userCredentials,
  registerResponse,
  loginResponse,
} from "../types/authData";
import { setAuth } from "../auth";

export const useRegister = () => {
  return useMutation<registerResponse, Error, authData>({
    mutationFn: register,
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.error(`Registration error (${error.message})`);
    },
  });
};

export const useLogin = () => {
  return useMutation<loginResponse, Error, userCredentials>({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
    onError: (error) => {
      console.error(`Login error (${error.message})`);
    },
  });
};
