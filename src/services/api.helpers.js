const isNetworkError = error =>
  !error?.response &&
  (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error');

module.exports = {
  isNetworkError,
};
