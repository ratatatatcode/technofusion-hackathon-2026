export type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  department?: string;
};

export type registerResponse = {
  message: string;
  userId: string;
};

export type loginResponse = {
  message: string;
  token: string;
  user: User;
};

export type userCredentials = {
  email: string;
  password: string;
};

export type authData = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: "student" | "admin";
  department?: string;
};
