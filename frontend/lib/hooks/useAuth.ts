import { register } from "../apis/authApi";
import { authData, authResponse } from "../types/authData";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation<authResponse, Error, authData>({
    mutationFn: register,
    onSuccess: (data) => console.log(`data.message`),
    onError: (error) => console.error(`data.message`),
  });
};
