type ErrorMessageHandler = (messageKey: string) => void;

let errorMessageHandler: ErrorMessageHandler | null = null;

export const setErrorMessageHandler = (handler: ErrorMessageHandler) => {
  errorMessageHandler = handler;
};

export const clearErrorMessageHandler = () => {
  errorMessageHandler = null;
};

export const showGlobalError = (messageKey: string) => {
  errorMessageHandler?.(messageKey);
};
