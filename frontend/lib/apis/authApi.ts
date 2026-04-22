import { authData, authResponse } from "../types/authData";

export const register = async (data: authData): Promise<authResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );

  const result: authResponse = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit code");
  }

  return result;
};
