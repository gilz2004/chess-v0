import React from "react";
import useGame from "../hooks/useGame";

export const MyContext = React.createContext();

const ContextProvider = ({ children }) => {
  const state = useGame();
  return <MyContext.Provider value={{ state }}>{children}</MyContext.Provider>;
};

export default ContextProvider;
