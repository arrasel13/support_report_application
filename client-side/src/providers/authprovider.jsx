import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import auth, { secondaryAuth } from "../firebase/firebase.init";
import useAxiosPublic from "../hooks/useaxiospublic";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenReady, setTokenReady] = useState(false);
  const axiosPublic = useAxiosPublic();

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(secondaryAuth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateCreatedUserProfile = (name, photo) => {
    return updateProfile(secondaryAuth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const secondayAuthLogout = () => {
    return signOut(secondaryAuth);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // const res = await axiosPublic.get("/userrole", {
      //   params: { email: currentUser.email },
      // });
      // const userRole = res.data?.role || "agent";
      // const updatedUser = { ...currentUser, role: userRole };
      // setUser(updatedUser);
      // setUser(currentUser);

      if (currentUser) {
        // console.log("Monitoring from AuthProvider: ", currentUser);

        // get user
        const userInfo = { email: currentUser.email };
        // console.log("User email from AuthProvider: ", userInfo);

        // JWT Token add and verify
        axiosPublic.post("/jwt", userInfo).then((res) => {
          const token = res.data?.token;
          if (token) {
            localStorage.setItem("__access-token", res.data.token);
            // setLoading(false);
            setTokenReady(true);
          } else {
            console.log("JWT fetch failed");
          }
        });
      } else {
        localStorage.removeItem("__access-token");
        setTokenReady(false);
        // setLoading(false);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      return unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    updateCreatedUserProfile,
    signIn,
    logOut,
    tokenReady,
    secondayAuthLogout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
