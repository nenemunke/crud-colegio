import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../api/firebase.config";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, provider);
};

export const logout = async () => {
  return await signOut(auth);
};
