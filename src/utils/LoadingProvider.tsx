import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);
  const value = useMemo(
    () => ({
      isLoading,
      showLoader,
      hideLoader,
    }),
    [hideLoader, isLoading, showLoader],
  );

  useEffect(() => {
    setLoadingHandlers({
      show: showLoader,
      hide: hideLoader,
    });

    return clearLoadingHandlers;
  }, [hideLoader, showLoader]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
