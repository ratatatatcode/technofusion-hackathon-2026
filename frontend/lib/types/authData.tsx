import { apiResponse } from "./apiResponse";

export interface authData {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  department?: string | null;
}

export interface userCredentials {
  email: string;
  password: string;
}

export interface registerResponse extends apiResponse {
  data: {
    userId: number;
  };
}

export interface loginResponse extends apiResponse {
  data: authData;
}
