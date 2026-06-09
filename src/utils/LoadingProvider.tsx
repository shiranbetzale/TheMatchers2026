import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {clearLoadingHandlers, setLoadingHandlers} from './LoadingManager';

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
  const value = useMemo(
    () => ({
      isLoading,
      showLoader: () => setIsLoading(true),
      hideLoader: () => setIsLoading(false),
    }),
    [isLoading],
  );

  useEffect(() => {
    setLoadingHandlers({
      show: value.showLoader,
      hide: value.hideLoader,
    });

    return clearLoadingHandlers;
  }, [value.hideLoader, value.showLoader]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
