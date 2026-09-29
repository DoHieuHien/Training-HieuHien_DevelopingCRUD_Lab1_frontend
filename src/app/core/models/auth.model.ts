export interface LoginRequest{
  username: string;
  password: string;
}

export interface  LoginRespond{
  token: string;
  username: string;
  role: string;
}
