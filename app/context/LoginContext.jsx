// import { createContext, useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";

// export const LoginContext = createContext();

// export const LoginProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     SecureStore.getItemAsync("token").then((token) => {
//       console.log(token, "<<<< token");
//       if (token) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     });
//   }, []);

//   const setTokenLogin = async (token) => {
//     try {
//       await SecureStore.setItemAsync("token", token);
//       setIsLoggedIn(true);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const deleteTokenLogin = async () => {
//     try {
//       await SecureStore.deleteItemAsync("token");
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <LoginContext.Provider
//       value={{ isLoggedIn, setIsLoggedIn, setTokenLogin, deleteTokenLogin }}
//     >
//       {children}
//     </LoginContext.Provider>
//   );
// };


import React, { createContext, useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  // State untuk menyimpan status login dan ID pengguna
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

   // Menyediakan nilai konteks kepada komponen-komponen turunan
  return (
    <LoginContext.Provider
      value={{ isLoggedIn, userId, setIsLoggedIn, setUserId }}
    >
      {children}
    </LoginContext.Provider>
  );
};
