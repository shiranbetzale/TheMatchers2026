import React, {createContext, useContext, useState} from 'react';

type LoadingContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const LoadingProvider = ({children}: {children: React.ReactNode}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        showLoader: () => setIsLoading(true),
        hideLoader: () => setIsLoading(false),
      }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
