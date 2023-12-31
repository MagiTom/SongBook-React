import React, { useContext, useState } from "react";

export interface ErrorContextModel {
  error: any;
  addError: (message: any) => void;
  removeError: () => void;
}

const ErrorContext = React.createContext<ErrorContextModel>({
  error: null,
  addError: () => Promise.resolve(),
  removeError: () => Promise.resolve(),
});

export const ErrorProvider: React.FC<any> = ({ children }) => {
  const [error, setError] = useState<string>("");

  const removeError = () => setError("");

  const addError = (message: string) => {
    setError(message || "Błąd");
    setTimeout(() => {
      removeError();
    }, 6000);
  };

  const contextValue = {
    error,
    addError,
    removeError,
  };
  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
