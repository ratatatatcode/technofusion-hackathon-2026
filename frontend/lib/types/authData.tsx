import { apiResponse } from "./apiResponse";

export interface authData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  department?: string | null;
}

export interface authResponse extends apiResponse {
  data: {
    userId: number;
  };
}
