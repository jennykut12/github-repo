import React, { createContext, useState } from "react";

export const Context = createContext({
  user: {
    fullName: "Jennifer david",
    login: "jennykut12",
    public_repos: 6,
    email: null,
    img: null,
  },
});

const AppProvider = ({ value, children }) => {
  const [user, setUser] = useState({
    user: {
      fullName: "Jennifer david",
      login: "jennykut12",
      public_repos: 6,
      email: null,
      img: null,
    },
  });
  return (
    <Context.Provider
      value={{
        user: user,
        setUser: setUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AppProvider;
