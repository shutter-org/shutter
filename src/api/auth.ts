import CryptoJS from "crypto-js";

const API_URL = "http://127.0.0.1:5000/";

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

export const encryptWithAES = (password: string) => {
  const key = "3b4ce34138872bb71626654f92ba747b";
  const cryptedKey = CryptoJS.enc.Utf8.parse(key);
  const encrypter = CryptoJS.AES.encrypt(password, cryptedKey, { mode: CryptoJS.mode.ECB });
  const encryptedPassword = encrypter.toString();
  return encryptedPassword;
}
