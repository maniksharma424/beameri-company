import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const queryClient = new QueryClient();
//<ReactQueryDevtools initialIsOpen={false} />

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </QueryClientProvider>
);
