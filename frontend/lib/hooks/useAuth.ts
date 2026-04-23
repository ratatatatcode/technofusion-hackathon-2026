import { register, login } from "../apis/authApi";
import {
  authData,
  userCredentials,
  registerResponse,
  loginResponse,
} from "../types/authData";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<registerResponse, Error, authData>({
    mutationFn: register,
    onSuccess: (data) => console.log(`data.message`),
    onError: (error) => console.error(`Registration error (${error.message})`),
  });
};

export const useLogin = () => {
  return useMutation<loginResponse, Error, userCredentials>({
    mutationFn: login,
    onSuccess: (data) => console.log(`data.message`),
    onError: (error) => console.error(`Login error (${error.message})`),
  });
};
