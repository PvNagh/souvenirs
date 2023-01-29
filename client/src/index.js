import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import authReducer from "./state/index.js";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);