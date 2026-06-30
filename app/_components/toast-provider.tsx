"use client";

import { ToastContainer } from "react-toastify";

export function ToastProvider() {
  return (
    <ToastContainer
      autoClose={3800}
      closeOnClick
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      position="top-right"
      theme="light"
    />
  );
}
