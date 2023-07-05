interface AuthTokenState {
    authToken: string;
  }
  
  const initialState: AuthTokenState = {
    authToken: '',
  };
  
  const authTokenReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'SET_AUTH_TOKEN':
        return {
          ...state,
          authToken: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default authTokenReducer;
  