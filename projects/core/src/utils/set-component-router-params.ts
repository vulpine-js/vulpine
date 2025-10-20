const setComponentRouterParams = (element: Element | null, params: any) => {
  if (element && 'addMetaData' in element && typeof element.addMetaData === 'function') {
    element.addMetaData({
      router: {
        params,
      },
    });
  }
};

export default setComponentRouterParams;
