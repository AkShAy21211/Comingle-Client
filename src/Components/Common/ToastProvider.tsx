// ToastProvider.tsx
import React, { ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled, { css } from "styled-components";

type ToastProviderProps = {
  children: ReactNode;
};

const StyledToastContainer = styled(ToastContainer)`
  width: 100%;
  max-width: max-content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  top: 10%;
`;

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <StyledToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
};

export default ToastProvider;
