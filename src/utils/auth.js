import { googleLogout } from "@react-oauth/google";
import { verifyTokenAPI } from "./api";

export const handleSuccess = async (credentialResponse, login) => {
  try {
    const res = await verifyTokenAPI(credentialResponse.credential); //
    login(res.data.token, res.data.user); //
  } catch (error) {
    console.error("Login Error:", error);
  }
};

export const handleLogout = (logout) => {
  googleLogout();
  logout();
  console.log("User logged out.");
};
