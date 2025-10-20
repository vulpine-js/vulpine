const getBrowserPath = () => {
  return window.location.href.replace(window.location.origin, '');
};

export default getBrowserPath;
