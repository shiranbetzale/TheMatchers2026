let showLoader: (() => void) | null = null;
let hideLoader: (() => void) | null = null;

export const setLoadingHandlers = (handlers: {
  show: () => void;
  hide: () => void;
}) => {
  showLoader = handlers.show;
  hideLoader = handlers.hide;
};

export const clearLoadingHandlers = () => {
  showLoader = null;
  hideLoader = null;
};

export const showGlobalLoader = () => {
  showLoader?.();
};

export const hideGlobalLoader = () => {
  hideLoader?.();
};
