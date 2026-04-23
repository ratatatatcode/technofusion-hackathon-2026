import {
  authData,
  userCredentials,
  registerResponse,
  loginResponse,
} from "../types/authData";

export const register = async (data: authData): Promise<registerResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result: registerResponse = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit code");
  }

  return result;
};

export const login = async (data: userCredentials): Promise<loginResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result: loginResponse = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit code");
  }

  return result;
};
