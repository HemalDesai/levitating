import { createStore } from 'redux';
import { combineReducers } from 'redux';
import authTokenReducer from './authTokenReducer';

const rootReducer = combineReducers({
  authToken: authTokenReducer,
});

const store = createStore(rootReducer);

export default store;
