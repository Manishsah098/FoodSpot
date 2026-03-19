import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import './index.css'
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import FoodContextProvider from "./context/FoodContext";

const root = createRoot(document.getElementById("root"));
root.render(
 <BrowserRouter>
 <FoodContextProvider>
    <App />
  </FoodContextProvider>
   </BrowserRouter>
 
);