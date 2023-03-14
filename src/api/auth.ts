const API_URL = "http://127.0.0.1:5000/";

export interface SignInUser {
  username: string;
  password: string;
}

export const SignInAPI = async (user: SignInUser) => {
  console.log("user", user);
  const response = await fetch(`${API_URL}signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: user.username, password: user.password }),
  });
  return response.json();
};
