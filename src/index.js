import React from "react";
import ReactDOM from "react-dom";
import Game from "./App";
import ContextProvider from "./context/Context";

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
    <Game />

    </ContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
