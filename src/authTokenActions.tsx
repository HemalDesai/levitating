export const setAuthToken = (authToken: string) => {
    return {
      type: 'SET_AUTH_TOKEN',
      payload: authToken,
    };
  };
  