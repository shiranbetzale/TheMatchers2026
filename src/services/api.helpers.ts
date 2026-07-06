export const isNetworkError = (error: unknown) => {
  const maybeError = error as {
    response?: unknown;
    code?: string;
    message?: string;
  };

  return (
    !maybeError?.response &&
    (maybeError?.code === 'ERR_NETWORK' ||
      maybeError?.message === 'Network Error')
  );
};
