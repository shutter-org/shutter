const API_URL = "http://127.0.0.1:5000";

export interface SignInUser {
  username: string;
  password: string;
}

export interface SignUpUser {
  username: string;
  password: string;
  email: string;
  name: string;
  birthdate: string;
}

export const signIn = async (user: SignInUser) => {
  console.log("user", user);
  const response = await fetch(`${API_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const signUp = async (user: SignUpUser) => {
  console.log("user", user);
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response;
};

export const ping = async (authKey: string) => {
  const key = "Bearer " + authKey;
  const response = await fetch(`${API_URL}/ping`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": key,
    },
  });
  return response;
}
